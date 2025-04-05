import fs from 'fs';
import { prompt, QuestionCollection } from 'inquirer';

interface InitAnswers {
  createExample: boolean;
}

export async function init(): Promise<void> {
  const examplePath = '.env.example';

  if (fs.existsSync(examplePath)) {
    console.log('env already exists');
    return;
  }

  const questions: QuestionCollection<InitAnswers> = [
    {
      type: 'confirm',
      name: 'createExample',
      message: 'Do you want to create a new .env.example file?',
      default: true,
    },
  ];

  const answers = await prompt<InitAnswers>(questions);

  if (!answers.createExample) {
    return;
  }

  const exampleContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=your_password

# API Configuration
API_URL=http://localhost:3000
API_KEY=your_api_key

# Feature Flags
DEBUG_MODE=false
ENABLE_CACHE=true

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=app.log

# Security Configuration
JWT_SECRET=your_jwt_secret
SESSION_TIMEOUT=3600
`;

  fs.writeFileSync(examplePath, exampleContent);
  console.log('Created .env.example file successfully');
}
