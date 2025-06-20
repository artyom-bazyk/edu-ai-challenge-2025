# Audio Transcription Analyzer

A console application that transcribes audio files using OpenAI's Whisper API, generates summaries using GPT, and provides detailed analytics including word count, speaking speed, and frequently mentioned topics.

## Features

- **Audio Transcription**: Uses OpenAI's Whisper-1 model to transcribe audio files
- **Content Summarization**: Generates comprehensive summaries using GPT-4.1-mini
- **Analytics**: Provides detailed analysis including:
  - Total word count
  - Speaking speed (words per minute)
  - Frequently mentioned topics with mention counts
- **File Management**: Automatically saves results to separate timestamped files
- **Console Output**: Displays results directly in the console

## Prerequisites

- Node.js (version 16 or higher)
- OpenAI API key
- Audio file to process

## Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your OpenAI API key**
   
   Create a `.env` file in the project root directory:
   ```bash
   # Copy the example file
   cp env.example .env
   ```
   
   Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```
   
   **Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

## Usage

### Basic Usage

```bash
node index.js <audio-file-path>
```

### Examples

```bash
# Process the provided audio file
node index.js CAR0004.mp3

# Process any other audio file
node index.js path/to/your/audio/file.mp3
```

### Supported Audio Formats

The application supports all audio formats that OpenAI Whisper can process, including:
- MP3
- MP4
- Mpeg
- MPGA
- M4A
- WAV
- WEBM

## Output

The application generates three types of output files in the `output/` directory:

1. **Transcription File** (`transcription_YYYY-MM-DDTHH-MM-SS-sssZ.md`)
   - Contains the full transcription of the audio
   - Includes metadata (filename, generation timestamp)

2. **Summary File** (`summary_YYYY-MM-DDTHH-MM-SS-sssZ.md`)
   - Contains a comprehensive summary of the audio content
   - Focuses on main points and key insights

3. **Analysis File** (`analysis_YYYY-MM-DDTHH-MM-SS-sssZ.json`)
   - Contains detailed analytics in JSON format
   - Includes word count, speaking speed, and frequently mentioned topics

### Example Analytics Output

```json
{
  "word_count": 1280,
  "speaking_speed_wpm": 132,
  "frequently_mentioned_topics": [
    { "topic": "Customer Onboarding", "mentions": 6 },
    { "topic": "Q4 Roadmap", "mentions": 4 },
    { "topic": "AI Integration", "mentions": 3 }
  ]
}
```

## Console Output

The application provides real-time feedback during processing:

```
Processing audio file: CAR0004.mp3
Transcribing audio file...
✓ Transcription completed
Generating summary...
✓ Summary generated
Analyzing transcription...
✓ Analysis completed

=== RESULTS ===
Transcription saved: transcription_2024-01-15T10-30-45-123Z.md
Summary saved: summary_2024-01-15T10-30-45-123Z.md
Analysis saved: analysis_2024-01-15T10-30-45-123Z.json

=== SUMMARY ===
[Summary content will be displayed here]

=== ANALYTICS ===
[Analytics JSON will be displayed here]

✓ Processing completed successfully!
```

## Error Handling

The application includes comprehensive error handling for:
- Missing API key
- Invalid audio file paths
- Network connectivity issues
- API rate limits
- Invalid audio formats

## API Requirements

- **OpenAI Whisper API**: Used for audio transcription (whisper-1 model)
- **OpenAI GPT-4.1-mini**: Used for summarization and analytics
- **API Key**: Required for authentication

## Cost Considerations

- Whisper API: $0.006 per minute of audio
- GPT-4.1-mini: ~$0.00015 per 1K input tokens, ~$0.0006 per 1K output tokens (for summary and analysis)

## Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable is not set"**
   - Ensure you have created a `.env` file with your API key
   - Check that the key is correctly formatted

2. **"Audio file not found"**
   - Verify the file path is correct
   - Ensure the file exists in the specified location

3. **"Error transcribing audio"**
   - Check your internet connection
   - Verify your OpenAI API key is valid
   - Ensure the audio file is in a supported format

4. **"Error generating summary" or "Error analyzing transcription"**
   - Check your OpenAI API quota
   - Verify the transcription was successful

### Getting Help

If you encounter issues:
1. Check the console output for specific error messages
2. Verify your OpenAI API key is valid and has sufficient credits
3. Ensure your audio file is in a supported format
4. Check your internet connection

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- The application only reads audio files and doesn't modify them

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application. 