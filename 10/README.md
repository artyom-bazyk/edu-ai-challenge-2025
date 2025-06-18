# Product Search Console App

This is a Node.js console application that allows you to search for products using natural language. The app leverages the OpenAI API with function calling to filter products from a dataset based on your preferences.

## Features
- Accepts user input in natural language via the console
- Uses OpenAI API with function calling for filtering logic
- Reads from a hardcoded dataset (`products.json`)
- Outputs a clear, structured list of matching products

## Requirements
- Node.js v18 or higher
- An OpenAI API key (do **not** commit your key to any repository)

## Setup
1. **Clone the repository** and navigate to the project directory.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Add your OpenAI API key:**
   - Create a file named `.env` in the project root.
   - Add the following line (replace with your actual key):
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```
   - **Do not commit your `.env` file or API key to version control.**
4. **Ensure `products.json` is present** in the project root (already included).

## Running the Application
Run the following command in your terminal:
```bash
node search.js
```

You will be prompted to enter your product search preferences in natural language (e.g., `I want a fitness tracker under $200 that is in stock`).

## How It Works
- The app reads your query and the product dataset.
- It sends both to the OpenAI API using the function calling mechanism (`gpt-4.1-mini` model).
- The API returns a filtered list of products matching your criteria.
- The app displays the results in a clear, structured format.

## Notes
- All filtering is performed by the OpenAI API, not manually in JavaScript.
- The OpenAI API key is required and must be kept private.
- The app does **not** store or log your API key.

## Example Output
See `sample_outputs.md` for example runs. 