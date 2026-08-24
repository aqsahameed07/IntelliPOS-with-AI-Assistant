// scripts/start-ai-service.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const aiServicePath = path.join(process.cwd(), 'ai-service');

// Detect Python command based on OS
const getPythonCommand = () => {
  if (os.platform() === 'win32') {
    // On Windows, try 'py' first, then 'python'
    return 'py';
  }
  return 'python3';
};

const pythonCmd = getPythonCommand();

console.log(`🐍 Using Python command: ${pythonCmd}`);

// Check if Python is installed
const pythonCheck = spawn(pythonCmd, ['--version']);
pythonCheck.on('error', () => {
  console.error(`❌ Python is not installed. Please install Python 3.8+`);
  console.error('   Download from: https://python.org');
  process.exit(1);
});

pythonCheck.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Python is not installed. Please install Python 3.8+`);
    process.exit(1);
  }

  // Check if pip is available
  console.log('📦 Installing Python dependencies...');
  const pipInstall = spawn(pythonCmd, ['-m', 'pip', 'install', '-r', 'requirements.txt'], {
    cwd: aiServicePath,
    stdio: 'inherit',
    shell: true,
  });

  pipInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to install Python dependencies');
      console.log('💡 Try running manually:');
      console.log(`   cd ai-service && ${pythonCmd} -m pip install -r requirements.txt`);
      process.exit(1);
    }

    console.log('✅ Python dependencies installed');
    console.log('🚀 Starting AI service...');

    // Start the AI service
    const aiService = spawn(pythonCmd, ['run.py'], {
      cwd: aiServicePath,
      stdio: 'inherit',
      shell: true,
    });

    aiService.on('error', (error) => {
      console.error('❌ Failed to start AI service:', error);
      process.exit(1);
    });

    aiService.on('close', (code) => {
      console.log(`AI service stopped with code ${code}`);
    });

    console.log('✅ AI service running on http://localhost:8000');
    console.log('📊 Health check: http://localhost:8000/health');
  });
});