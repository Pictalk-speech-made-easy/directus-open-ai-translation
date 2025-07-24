import { request, log } from 'directus:api'

export default {
	id: 'directus-open-ai-translation',
	handler: async ({ api_key, text, target_lang }) => {
		try {
			const url = `https://api.openai.com/v1/chat/completions`
			const response = await request(url, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${api_key}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					"model": "gpt-4.1-nano",
					"messages": [
						{
						  "role": "system",
						  "content": `You are a translation assistant. I will provide you with a text containing HTML or JSON formatting, and you need to translate it into the specified language while preserving the HTML or JSON tags. Do not translate any anchor href.\n                          \nPlease note these special cases:\n- The terms \"Pictalk Communication\" and \"Agenda CAA\" (or \"Pictalk Agenda\") must be changed to \"Pictalk AAC\" and \"Pictalk Buddy\" respectively in all languages.\n- The terms \"Creator CAA\" and \"CAA Facile\" must be changed to \"Pictalk Creator\" and \"Pictalk Go\" respectively in all languages.\n- The terms \"Pictalk AAC\" and \"Pictalk Buddy\" must remain unchanged in all languages.\n- The terms \"Pictalk Creator\" and \"Pictalk Go\" must remain unchanged in all languages.\n- For the abbreviation of Augmentative and Alternative Communication, use:\n  - \"CAA\" in French, Spanish, Portuguese, and Italian,\n  - \"AAC\" in English,\n  - \"UK\" in German.\n- When translating the full term for Augmentative and Alternative Communication, use:\n  - \"Communication Alternative et Améliorée\" for French,\n  - \"Unterstützte Kommunikation\" for German,\n  - \"Comunicación Aumentativa y Alternativa\" for Spanish,\n  - \"Comunicação Aumentativa e Alternativa\" for Portuguese,\n  - \"Comunicazione Aumentativa e Alternativa\" for Italian,\n  - \"Augmentative and Alternative Communication\" for English, \"Alternativ og supplerende kommunikasjon (ASK)\" for Norwegian, \"Puhetta tukeva ja korvaava kommunikaatio\" (AAC/TTK), \"Ondersteunde communicatie or Ondersteunde en alternatieve communicatie (OAC)\" in Dutch, \"Alternativ och kompletterande kommunikation (AKK)\" in Swedish, \"Alternativ og supplerende kommunikation (ASK)\" in Danish.\n\nThe supported target languages are: it (Italian), de (German), en (English), es (Spanish), pt (Portuguese), fr (French), se (Swedish), dk (Danish), nl (Dutch) and fi (Finnish) and no (Norwegian). Please only provide the translated text without any additional explanations or modifications.`
						},
						{
						  "role": "user",
						  "content": `Translate the following text to ${target_lang}: ${text}`
						}
					  ],					
				})
			})
			if(response.status != 200) throw new Error('An error occurred when Open AI API')
			const translatedContent = response.data.choices[0].message.content;
			if (typeof translatedContent === 'object' && translatedContent !== null) return JSON.stringify(translatedContent);
            return translatedContent;
		} catch(error) {
			log(error.message)
			throw new Error(error.message)
		}
	},
};