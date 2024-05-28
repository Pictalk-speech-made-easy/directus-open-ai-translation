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
					"model": "gpt-3.5-turbo",
					"messages": [
						{
						  "role": "system",
						  "content": "You are a translation assistant. I will provide you with a text containing HTML formatting, and you need to translate it into the specified language while preserving the HTML tags. Please only provide the translated text without any additional explanations or modifications."
						},
						{
						  "role": "user",
						  "content": `Translate the following text to ${target_lang}: ${text}`
						}
					  ],
					
				})
			})
			if(response.status != 200) throw new Error('An error occurred when Open AI API')
				log(response.data);
			return response.data.choices[0].message.content;
		} catch(error) {
			log(error.message)
			throw new Error(error.message)
		}
	},
};
