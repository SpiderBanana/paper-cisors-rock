const URL = "https://teachablemachine.withgoogle.com/models/g_mttcAyJ/";

    let model, webcam, labelContainer, maxPredictions;

    // Load the image model and setup the webcam
    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // load the model and metadata
        // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
        // or files from your local hard drive
        // Note: the pose library adds "tmImage" object to your window (window.tmImage)
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        for (let i = 0; i < maxPredictions; i++) { // and class labels
            labelContainer.appendChild(document.createElement("div"));
        }
    }

    async function loop() {
        webcam.update(); // update the webcam frame
        await predict();
        window.requestAnimationFrame(loop);
    }

    // run the webcam image through the image model


    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        window.currentPredictions = prediction;
    
        // Déterminer le meilleur geste selon la probabilité
        let bestGesture = '';
        let maxProb = 0;
        for (let i = 0; i < prediction.length; i++) {
            if (prediction[i].probability > maxProb) {
                maxProb = prediction[i].probability;
                bestGesture = prediction[i].className;
            }
        }
        
        // Mappage geste => emoji
        const emojiMap = {
            pierre: "✊",
            feuille: "🖐️",
            ciseau: "✌️"
        };
        
        // Afficher "Votre choix: [geste + emoji]"
        labelContainer.innerHTML = `Votre choix : ${bestGesture} ${emojiMap[bestGesture] || ''}`;
    }
