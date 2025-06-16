# Service Analysis Report Generator

A lightweight Node.js console application that generates comprehensive, markdown-formatted reports about services or products using AI. The application can analyze either a known service name (e.g., "Spotify", "Notion") or raw service description text.

## Features

- Accepts service names or detailed descriptions as input
- Generates comprehensive analysis reports including:
  - Brief History
  - Target Audience
  - Core Features
  - Unique Selling Points
  - Business Model
  - Tech Stack Insights
  - Perceived Strengths
  - Perceived Weaknesses
- Beautiful console output with markdown formatting

## Prerequisites

- Node.js 16 or higher
- npm (Node Package Manager)
- OpenAI API key

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd service-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual OpenAI API key.

## Usage

1. Start the application:
   ```bash
   npm start
   ```

2. When prompted, enter either:
   - A service name (e.g., "Spotify", "Notion")
   - A detailed service description

3. The application will generate and display a comprehensive analysis report in the terminal.

## Example Usage

1. Analyzing a known service:
   ```
   Enter service name or description: Spotify
   ```

2. Analyzing a service description:
   ```
   Enter service name or description: A cloud-based project management tool that helps teams collaborate and track their work
   ```

## Output Format

The generated report will include the following sections:
- Brief History
- Target Audience
- Core Features
- Unique Selling Points
- Business Model
- Tech Stack Insights
- Perceived Strengths
- Perceived Weaknesses

## Security Note

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- The `.env` file is included in `.gitignore` to prevent accidental commits

## Troubleshooting

If you encounter any issues:
1. Ensure you have Node.js 16+ installed
2. Verify your OpenAI API key is correct in the `.env` file
3. Check your internet connection
4. Ensure all dependencies are installed correctly

## Sample Outputs

See `sample_outputs.md` for example outputs from the application. 