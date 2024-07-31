import React, { useEffect } from 'react';
import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENAI_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true,
});

const Gemini = ({ imageUrl, onProcessed }) => {
  useEffect(() => {
    if (imageUrl) {
      callChatGPT(imageUrl);
    }
  }, [imageUrl]);

  const callChatGPT = async (imageUrl) => {
    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI that detects clothing attributes like color, type of clothing (short, pants, etc.), material, etc. Using the table provided, fill in the template JSON object as accurately as you can, based on the provided image URL. Ensure the following rules are not broken under any circumstances: Do not UNDER ANY CIRCUMSTANCES add any comments, characters, words or symbols before or after the object being created. ONLY the object itself should be returned as a response. If a key can be found in the table provided, ONLY USE THE PROVIDED VALUES. If a key has a value already given, use that value. Fill the prompt value with 'Casual', 'Work' or 'Business Casual'".

            VALUES FOR SPECIFIC PROPERTIES BELOW:

            -START OF TABLE-
            "type_id" values:
            1: T-shirt
            2: Jacket
            3: Sweater
            4: Shorts
            5: Pants
            6: Tank-Top
            7: Sandals
            8: Sneakers
            9: Boots
            10: Heels
            11: Suit
            12: Button-Up Shirt

            "material_id" values:
            1: Cotton
            2: Polyester
            3: Wool
            4: Silk
            5: Denim
            6: Leather
            7: Latex
            8: Rubber
            9: Canvas

            "temperature_range_id" values:
            1: Very Cold (-50 to 0)
            2: Cold (1 to 50)
            3: Mild (51 to 70)
            4: Warm (71 to 140)

            "humidity_id" values:
            1: Very Low (0 to 20)
            2: Low (21 to 40)
            3: Medium (41 to 60)
            4: High (61 to 80)
            5: Very High (81 to 100)
            -END OF TABLE-
            
            FILL the below template JSON object using the values of the table above:
            
            {
              "color": "color_value",
              "type_id": type_id_value,
              "material_id": material_id_value,
              "temperature_range_id": temperature_range_id_value,
              "humidity_id": humidity_id_value,
              "waterproof": waterproof_value,
              "prompt": (FILL),
              "image_base64": "base64_encoded_image_string",
              "image_url": "${imageUrl}"
            }`
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl,
                  detail: "auto"
                },
            }],
          },
        ],
      });

      const responseJson = result.choices[0].message.content;
      onProcessed(responseJson); // Callback to notify that processing is complete
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  };

  return null;
};

export default Gemini;
