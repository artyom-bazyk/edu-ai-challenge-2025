import OpenAI from 'openai';
import dotenv from 'dotenv';
import chalk from 'chalk';
import readlineSync from 'readline-sync';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

function getAnalysisPrompt(serviceName, description) {
    const inputText = serviceName 
        ? `Analyze the service '${serviceName}'`
        : `Analyze the following service description:\n${description}`;

    return `Please provide a comprehensive analysis of the service in markdown format. Include the following sections:

# Service Analysis Report

## Brief History
[Include founding year, key milestones, and important developments]

## Target Audience
[Describe the primary user segments and demographics]

## Core Features
[List 2-4 key functionalities that define the service]

## Unique Selling Points
[Highlight what makes this service stand out from competitors]

## Business Model
[Explain how the service generates revenue]

## Tech Stack Insights
[Note any visible or mentioned technologies used]

## Perceived Strengths
[List the main advantages and positive aspects]

## Perceived Weaknesses
[Identify potential drawbacks or limitations]

${inputText}`;
}

async function generateAnalysis(serviceName, description) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a professional service analyst with expertise in business, technology, and user experience."
                },
                {
                    role: "user",
                    content: getAnalysisPrompt(serviceName, description)
                }
            ],
            temperature: 0.7,
        });
        return response.choices[0].message.content;
    } catch (error) {
        console.error(chalk.red(`Error generating analysis: ${error.message}`));
        process.exit(1);
    }
}

async function main() {
    console.log(chalk.blue.bold('Service Analysis Report Generator'));
    console.log('Enter a service name (e.g., "Spotify") or paste a service description text.');
    console.log('Press Ctrl+C to cancel at any time.\n');

    try {
        // Get input from user
        const input = readlineSync.question('Enter service name or description: ').trim();

        if (!input) {
            console.error(chalk.red('Error: No input provided'));
            process.exit(1);
        }

        // Determine if input is a service name or description
        const isServiceName = input.split(' ').length <= 3 && !/[.,;]/.test(input);

        if (isServiceName) {
            console.log(chalk.green(`\nAnalyzing service: ${input}`));
            const analysis = await generateAnalysis(input);
            displayAnalysis(analysis, input);
        } else {
            console.log(chalk.green('\nAnalyzing provided description...'));
            const analysis = await generateAnalysis(null, input);
            displayAnalysis(analysis, input);
        }
    } catch (error) {
        console.error(chalk.red(`An error occurred: ${error.message}`));
        process.exit(1);
    }
}

function displayAnalysis(analysis, input) {
    // Split into sections and display with proper markdown formatting
    const sections = analysis.split('\n\n');
    sections.forEach(section => {
        if (section.trim()) {
            // Skip the summary line that starts with "This analysis provides"
            if (section.startsWith('This analysis provides')) {
                return;
            }
            
            if (section.startsWith('# ')) {
                console.log(chalk.bold.blue(section));
            } else if (section.startsWith('## ')) {
                console.log('\n' + chalk.bold.green(section));
            } else if (section.startsWith('- ')) {
                // Format list items
                const items = section.split('\n');
                items.forEach(item => {
                    if (item.trim()) {
                        console.log(chalk.yellow('• ') + item.substring(2));
                    }
                });
            } else if (section.startsWith('**')) {
                // Format bold text
                console.log(chalk.bold(section));
            } else if (!section.startsWith('---') && !section.startsWith('===')) {
                // Skip decorative elements but show other content
                console.log(section);
            }
        }
    });
}

// Run the application
main(); 