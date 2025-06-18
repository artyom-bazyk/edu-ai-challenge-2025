import { config } from 'dotenv'
import { readFile } from 'fs/promises'
import readline from 'readline'
import { OpenAI } from 'openai'

config()

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => rl.question(prompt, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function main() {
  const products = JSON.parse(await readFile('./products.json', 'utf-8'))
  const userQuery = await getUserInput('Enter your product search preferences: ')

  const functionSchema = {
    name: 'filter_products',
    description: 'Filter products based on user preferences',
    parameters: {
      type: 'object',
      properties: {
        filtered_products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              price: { type: 'number' },
              rating: { type: 'number' },
              in_stock: { type: 'boolean' }
            },
            required: ['name', 'price', 'rating', 'in_stock']
          }
        }
      },
      required: ['filtered_products']
    }
  }

  const systemPrompt = `\
You are a product search assistant. 
Given a list of products and a user query, return only the products that match the user's preferences.
Do not explain your reasoning. Only return the filtered products in the structured format.
`

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `User query: ${userQuery}\nProducts: ${JSON.stringify(products)}` }
  ]

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages,
    functions: [functionSchema],
    function_call: { name: 'filter_products' }
  })

  const filtered = JSON.parse(response.choices[0].message.function_call.arguments).filtered_products

  if (filtered.length === 0) {
    console.log('No products found matching your criteria.')
    return
  }

  console.log('Filtered Products:')
  for (let i = 0; i < filtered.length; i++) {
    const p = filtered[i]
    console.log(`${i + 1}. ${p.name} - $${p.price}, Rating: ${p.rating}, In Stock${p.in_stock ? '' : ' (Out of Stock)'}`)
  }
}

main() 