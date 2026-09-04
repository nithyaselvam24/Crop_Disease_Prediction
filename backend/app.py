import os
import json
import asyncio
import tempfile

import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
import edge_tts


# =========================================================
# 1. FLASK APP
# =========================================================

app = Flask(__name__)

CORS(app)


# =========================================================
# 2. PROJECT PATHS
# =========================================================

BACKEND_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

PROJECT_DIR = os.path.dirname(
    BACKEND_DIR
)


MODEL_PATH = os.path.join(
    PROJECT_DIR,
    "model",
    "crop_disease_model.keras"
)


CLASS_NAMES_PATH = os.path.join(
    PROJECT_DIR,
    "model",
    "class_names.json"
)


DISEASE_INFO_PATH = os.path.join(
    BACKEND_DIR,
    "disease_info.json"
)


# =========================================================
# 3. CHECK FILES
# =========================================================

print("\n========================================")
print("   CROP DISEASE PREDICTION API")
print("========================================")

print("Project folder :", PROJECT_DIR)
print("Model path     :", MODEL_PATH)
print("Class path     :", CLASS_NAMES_PATH)
print("Disease info   :", DISEASE_INFO_PATH)


if not os.path.exists(MODEL_PATH):

    raise FileNotFoundError(
        f"\nModel file not found:\n{MODEL_PATH}"
    )


if not os.path.exists(CLASS_NAMES_PATH):

    raise FileNotFoundError(
        f"\nclass_names.json not found:\n{CLASS_NAMES_PATH}"
    )


# =========================================================
# 4. LOAD CNN MODEL
# =========================================================

print("\nLoading CNN model...")

model = tf.keras.models.load_model(
    MODEL_PATH
)

print("Model loaded successfully.")


# =========================================================
# 5. LOAD CLASS NAMES
# =========================================================

with open(
    CLASS_NAMES_PATH,
    "r",
    encoding="utf-8"
) as file:

    class_names = json.load(file)


print(
    "Number of classes:",
    len(class_names)
)


# =========================================================
# 6. LOAD DISEASE INFORMATION
# =========================================================

disease_info = {}


if os.path.exists(DISEASE_INFO_PATH):

    with open(
        DISEASE_INFO_PATH,
        "r",
        encoding="utf-8"
    ) as file:

        disease_info = json.load(file)

    print(
        "Disease information loaded."
    )

else:

    print(
        "Warning: disease_info.json not found."
    )

    print(
        "Prediction will still work."
    )


# =========================================================
# 7. IMAGE PREPROCESSING
# =========================================================

def preprocess_image(image):

    # Convert image to RGB
    image = image.convert("RGB")


    # Resize image
    image = image.resize(
        (224, 224)
    )


    # Convert to NumPy array
    image_array = np.array(
        image,
        dtype=np.float32
    )


    # Normalize pixel values
    image_array = (
        image_array / 255.0
    )


    # Add batch dimension
    image_array = np.expand_dims(
        image_array,
        axis=0
    )


    return image_array


# =========================================================
# 8. HOME ROUTE
# =========================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "status": "success",

        "message":
        "Crop Disease Prediction API is running",

        "model_loaded": True,

        "classes":
        len(class_names)

    })


# =========================================================
# 9. HEALTH ROUTE
# =========================================================

@app.route(
    "/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "status": "healthy",

        "model_loaded": True,

        "classes":
        len(class_names)

    })


# =========================================================
# 10. PREDICTION ROUTE
# =========================================================

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    try:

        # -------------------------------------------------
        # Check uploaded file
        # -------------------------------------------------

        if "file" not in request.files:

            return jsonify({

                "success": False,

                "error":
                "No image file uploaded"

            }), 400


        file = request.files["file"]


        # -------------------------------------------------
        # Check filename
        # -------------------------------------------------

        if file.filename == "":

            return jsonify({

                "success": False,

                "error":
                "No image selected"

            }), 400


        # -------------------------------------------------
        # Open image
        # -------------------------------------------------

        image = Image.open(file)

        print(
            "\nImage received:",
            file.filename
        )


        # -------------------------------------------------
        # Preprocess image
        # -------------------------------------------------

        processed_image = (
            preprocess_image(image)
        )


        # -------------------------------------------------
        # CNN prediction
        # -------------------------------------------------

        predictions = model.predict(
            processed_image,
            verbose=0
        )


        probabilities = predictions[0]


        # -------------------------------------------------
        # Get predicted class index
        # -------------------------------------------------

        predicted_index = int(
            np.argmax(
                probabilities
            )
        )


        # -------------------------------------------------
        # Calculate confidence
        # -------------------------------------------------

        confidence = float(
            probabilities[
                predicted_index
            ] * 100
        )


        # -------------------------------------------------
        # Get class name
        # -------------------------------------------------

        if isinstance(
            class_names,
            dict
        ):

            predicted_class = (
                class_names[
                    str(predicted_index)
                ]
            )

        else:

            predicted_class = (
                class_names[
                    predicted_index
                ]
            )


        print(
            "Predicted class:",
            predicted_class
        )

        print(
            "Confidence:",
            round(
                confidence,
                2
            ),
            "%"
        )


        # -------------------------------------------------
        # Confidence level
        # -------------------------------------------------

        if confidence >= 80:

            confidence_level = "High"

        elif confidence >= 60:

            confidence_level = "Medium"

        else:

            confidence_level = "Low"


        # -------------------------------------------------
        # Disease information
        # -------------------------------------------------

        info = disease_info.get(
            predicted_class,
            {}
        )


        # -------------------------------------------------
        # Crop name
        # -------------------------------------------------

        crop = info.get(
            "crop",
            "Unknown"
        )


        # -------------------------------------------------
        # Disease name
        # -------------------------------------------------

        disease = info.get(
            "disease",
            predicted_class
        )


        # -------------------------------------------------
        # Response
        # -------------------------------------------------

        response = {

            "success": True,

            "predicted_class":
            predicted_class,

            "crop":
            crop,

            "disease":
            disease,

            "confidence":
            round(
                confidence,
                2
            ),

            "confidence_level":
            confidence_level,


            # ---------------------------------------------
            # Symptoms
            # ---------------------------------------------

            "symptoms_en":
            info.get(
                "symptoms_en",
                "Information not available."
            ),

            "symptoms_ta":
            info.get(
                "symptoms_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Severity
            # ---------------------------------------------

            "severity_en":
            info.get(
                "severity_en",
                "Information not available."
            ),

            "severity_ta":
            info.get(
                "severity_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Treatment
            # ---------------------------------------------

            "treatment_en":
            info.get(
                "treatment_en",
                "Information not available."
            ),

            "treatment_ta":
            info.get(
                "treatment_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Organic solution
            # ---------------------------------------------

            "organic_solution_en":
            info.get(
                "organic_solution_en",
                "Information not available."
            ),

            "organic_solution_ta":
            info.get(
                "organic_solution_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Nutrition
            # ---------------------------------------------

            "nutrition_en":
            info.get(
                "nutrition_en",
                "Information not available."
            ),

            "nutrition_ta":
            info.get(
                "nutrition_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Prevention
            # ---------------------------------------------

            "prevention_en":
            info.get(
                "prevention_en",
                "Information not available."
            ),

            "prevention_ta":
            info.get(
                "prevention_ta",
                "தகவல் கிடைக்கவில்லை."
            ),


            # ---------------------------------------------
            # Warning
            # ---------------------------------------------

            "warning_en":
            info.get(
                "warning_en",
                "Information not available."
            ),

            "warning_ta":
            info.get(
                "warning_ta",
                "தகவல் கிடைக்கவில்லை."
            )

        }


        return jsonify(
            response
        )


    except Exception as error:

        print(
            "\nPrediction error:"
        )

        print(error)


        return jsonify({

            "success": False,

            "error":
            str(error)

        }), 500


# =========================================================
# 11. TEXT TO SPEECH ROUTE
# =========================================================

@app.route(
    "/tts",
    methods=["POST"]
)
def text_to_speech():

    temp_path = None


    try:

        # -------------------------------------------------
        # Get JSON data
        # -------------------------------------------------

        data = request.get_json(
            silent=True
        ) or {}


        # -------------------------------------------------
        # Get text
        # -------------------------------------------------

        text = str(
            data.get(
                "text",
                ""
            )
        ).strip()


        # -------------------------------------------------
        # Get language
        # -------------------------------------------------

        language = str(
            data.get(
                "language",
                "ta"
            )
        ).lower()


        # -------------------------------------------------
        # Validate text
        # -------------------------------------------------

        if not text:

            return jsonify({

                "success": False,

                "error":
                "Text is required"

            }), 400


        # -------------------------------------------------
        # Select voice
        # -------------------------------------------------

        if language == "ta":

            voice = (
                "ta-IN-PallaviNeural"
            )

        else:

            voice = (
                "en-IN-NeerjaNeural"
            )


        print("\n========================================")
        print("        TEXT TO SPEECH REQUEST")
        print("========================================")

        print(
            "Language :",
            language
        )

        print(
            "Voice    :",
            voice
        )

        print(
            "Text     :",
            text[:150]
        )


        # -------------------------------------------------
        # Create temporary MP3 file
        # -------------------------------------------------

        temp_file = (
            tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".mp3"
            )
        )


        temp_path = (
            temp_file.name
        )


        temp_file.close()


        # -------------------------------------------------
        # Generate audio
        # -------------------------------------------------

        async def generate_audio():

            communicate = (
                edge_tts.Communicate(
                    text,
                    voice
                )
            )

            await communicate.save(
                temp_path
            )


        asyncio.run(
            generate_audio()
        )


        # -------------------------------------------------
        # Check audio file
        # -------------------------------------------------

        if not os.path.exists(
            temp_path
        ):

            raise Exception(
                "TTS audio file was not generated."
            )


        print(
            "TTS audio generated successfully."
        )


        # -------------------------------------------------
        # Send MP3 file
        # -------------------------------------------------

        response = send_file(

            temp_path,

            mimetype="audio/mpeg",

            as_attachment=False

        )


        # -------------------------------------------------
        # Delete temporary file
        # -------------------------------------------------

        @response.call_on_close
        def cleanup():

            try:

                if (
                    temp_path
                    and
                    os.path.exists(
                        temp_path
                    )
                ):

                    os.remove(
                        temp_path
                    )

                    print(
                        "Temporary TTS file deleted."
                    )

            except Exception as cleanup_error:

                print(
                    "TTS cleanup error:",
                    cleanup_error
                )


        return response


    except Exception as error:

        print(
            "\nTTS error:"
        )

        print(error)


        # -------------------------------------------------
        # Cleanup after error
        # -------------------------------------------------

        try:

            if (
                temp_path
                and
                os.path.exists(
                    temp_path
                )
            ):

                os.remove(
                    temp_path
                )

        except Exception:

            pass


        return jsonify({

            "success": False,

            "error":
            str(error)

        }), 500


# =========================================================
# 12. RUN SERVER
# =========================================================

if __name__ == "__main__":

    print("\n========================================")
    print("        SERVER STARTING")
    print("========================================")

    print(
        "URL: http://127.0.0.1:5000"
    )

    print(
        "Prediction API: /predict"
    )

    print(
        "TTS API       : /tts"
    )

    print("========================================\n")


    app.run(

        host="127.0.0.1",

        port=5000,

        debug=False

    )