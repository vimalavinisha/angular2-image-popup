node {
    def nodeHome = tool name: 'node-10.11.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}:${nodeHome}/bin:${env.PATH}"

    stage('check tools') {
        echo env.PATH
        sh "node -v"
        sh "npm -v"
        sh "npm install -g npm@latest"
        sh "node -v"
        sh "npm -v"
    }

    stage('checkout') {
        checkout scm
    }

    stage('npm install @angular/cli globally') {
        sh "npm install -g @angular/cli@latest"
    }

    stage('npm ci') {
        sh "npm ci"
    }

    stage('npm clean') {
        sh "npm run clean:all"
    }

    stage('npm ci examples') {
        sh "cd examples/systemjs && npm ci"
        sh "cd examples/angular-cli && npm ci"
        sh "cd examples/angular-cli-6 && npm ci"
        sh "cd examples/angular-cli-material && npm ci"
        sh "cd examples/universal && npm ci"
    }

    stage('npm run build lib') {
        sh "npm run build:all"
    }

    stage('main example') {
        sh "npm run build:main:dev"
        sh "npm run build:main:prod"
    }

    stage('angular-cli example') {
        sh "cd examples/angular-cli && npm run build:dev"
        sh "cd examples/angular-cli && npm run build:prod"
        sh "cd examples/angular-cli && xvfb-run npm run test:ci:jenkins"
    }

    stage('universal example') {
        sh "cd examples/universal && npm run build:dev"
        sh "cd examples/universal && npm run build:prod"
        sh "cd examples/universal && npm run build:ssr"
        sh "cd examples/universal && npm run build:prerender"
    }

    stage('npm test') {
        sh "xvfb-run npm run test:ci:jenkins"
    }

    stage('npm e2e') {
        sh "xvfb-run npm run e2e:ci"
    }

    stage('npm typedoc') {
        sh "npm run docs:typedoc"
    }

    stage('npm compodoc') {
        sh "npm run docs:compodoc"
    }
}
