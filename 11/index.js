import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

class AudioAnalyzer {
  constructor() {
    this.outputDir = path.join(__dirname, 'output')
    this.ensureOutputDirectory()
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true })
    }
  }

  async transcribeAudio(audioFilePath) {
    try {
      console.log('Transcribing audio file...')
      
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioFilePath),
        model: 'whisper-1',
        response_format: 'text'
      })

      return transcription
    } catch (error) {
      console.error('Error transcribing audio:', error.message)
      throw error
    }
  }

  async summarizeTranscription(transcription) {
    try {
      console.log('Generating summary...')
      
      const summary = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise summaries of transcribed audio content. Focus on the main points and key insights.'
          },
          {
            role: 'user',
            content: `Please provide a comprehensive summary of the following transcription:\n\n${transcription}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })

      return summary.choices[0].message.content
    } catch (error) {
      console.error('Error generating summary:', error.message)
      throw error
    }
  }

  async analyzeTranscription(transcription) {
    try {
      console.log('Analyzing transcription...')
      
      const analysis = await openai.chat.completions.create({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an analytics assistant. Analyze the transcription and return a JSON object with word_count, speaking_speed_wpm, and frequently_mentioned_topics as an array of objects with topic and mentions properties. Assume average speaking speed is 150 WPM if duration cannot be determined. Return only valid JSON in this exact format: {"word_count": number, "speaking_speed_wpm": number, "frequently_mentioned_topics": [{"topic": "string", "mentions": number}]}'
          },
          {
            role: 'user',
            content: `Analyze this transcription and provide analytics in JSON format:\n\n${transcription}`
          }
        ],
        max_tokens: 800,
        temperature: 0.1
      })

      const analysisText = analysis.choices[0].message.content
      return JSON.parse(analysisText)
    } catch (error) {
      console.error('Error analyzing transcription:', error.message)
      throw error
    }
  }

  saveTranscription(transcription, filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputFilename = `transcription_${timestamp}.md`
    const outputPath = path.join(this.outputDir, outputFilename)
    
    const content = `# Audio Transcription

**File:** ${filename}
**Generated:** ${new Date().toISOString()}

## Transcription

${transcription}
`

    fs.writeFileSync(outputPath, content)
    return outputFilename
  }

  saveSummary(summary, filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputFilename = `summary_${timestamp}.md`
    const outputPath = path.join(this.outputDir, outputFilename)
    
    const content = `# Audio Summary

**File:** ${filename}
**Generated:** ${new Date().toISOString()}

## Summary

${summary}
`

    fs.writeFileSync(outputPath, content)
    return outputFilename
  }

  saveAnalysis(analysis, filename) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const outputFilename = `analysis_${timestamp}.json`
    const outputPath = path.join(this.outputDir, outputFilename)
    
    const content = {
      file: filename,
      generated: new Date().toISOString(),
      analytics: analysis
    }

    fs.writeFileSync(outputPath, JSON.stringify(content, null, 2))
    return outputFilename
  }

  async processAudioFile(audioFilePath) {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set. Please check your .env file.')
      }

      const filename = path.basename(audioFilePath)
      console.log(`Processing audio file: ${filename}`)

      // Step 1: Transcribe audio
      const transcription = await this.transcribeAudio(audioFilePath)
      console.log('✓ Transcription completed')

      // Step 2: Generate summary
      const summary = await this.summarizeTranscription(transcription)
      console.log('✓ Summary generated')

      // Step 3: Analyze transcription
      const analysis = await this.analyzeTranscription(transcription)
      console.log('✓ Analysis completed')

      // Step 4: Save files
      const transcriptionFile = this.saveTranscription(transcription, filename)
      const summaryFile = this.saveSummary(summary, filename)
      const analysisFile = this.saveAnalysis(analysis, filename)

      console.log('\n=== RESULTS ===')
      console.log(`Transcription saved: ${transcriptionFile}`)
      console.log(`Summary saved: ${summaryFile}`)
      console.log(`Analysis saved: ${analysisFile}`)

      // Step 5: Display results
      console.log('\n=== SUMMARY ===')
      console.log(summary)

      console.log('\n=== ANALYTICS ===')
      console.log(JSON.stringify(analysis, null, 2))

      return {
        transcription,
        summary,
        analysis,
        files: {
          transcription: transcriptionFile,
          summary: summaryFile,
          analysis: analysisFile
        }
      }

    } catch (error) {
      console.error('Error processing audio file:', error.message)
      throw error
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: node index.js <audio-file-path>')
    console.log('Example: node index.js CAR0004.mp3')
    process.exit(1)
  }

  const audioFilePath = args[0]
  
  if (!fs.existsSync(audioFilePath)) {
    console.error(`Error: Audio file '${audioFilePath}' not found.`)
    process.exit(1)
  }

  const analyzer = new AudioAnalyzer()
  
  try {
    await analyzer.processAudioFile(audioFilePath)
    console.log('\n✓ Processing completed successfully!')
  } catch (error) {
    console.error('\n✗ Processing failed:', error.message)
    process.exit(1)
  }
}

// Run the application
main()

export default AudioAnalyzer 