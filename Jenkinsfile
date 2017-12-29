node {
    def nodeHome = tool name: 'node-9.3.0', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "${nodeHome}/bin:${env.PATH}"

    stage('check tools') {
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
        sh "npm install -g @angular/cli@1.6.0"
    }

    stage('npm install') {
        sh "npm install"
    }

    stage('npm clean') {
        sh "npm run clean:all"
    }

    stage('npm install examples') {
        sh "cd examples/systemjs && npm install"
        sh "cd examples/webpack && npm install"
        sh "cd examples/angular-cli && npm install"
        sh "cd examples/universal && npm install"
    }

    stage('npm run build lib') {
        sh "npm run build:all"
    }

    stage('main example') {
        sh "npm run build:main:dev"
        sh "npm run build:main:prod"
        sh "npm run test:ci"
    }

    stage('webpack example') {
        sh "cd examples/webpack && npm run build:dev"
        sh "cd examples/webpack && npm run build:prod"
        sh "cd examples/webpack && npm run clean && npm run build:prod:aot"
        sh "cd examples/webpack && npm test"
    }

    stage('angular-cli example') {
        sh "cd examples/angular-cli && npm run build:dev"
        sh "cd examples/angular-cli && npm run build:prod"
        sh "cd examples/angular-cli && npm run test:ci"
    }

    stage('universal example') {
        sh "cd examples/universal && npm run build:dev"
        sh "cd examples/universal && npm run build:prod"
        sh "cd examples/universal && npm run build:ssr"
        sh "cd examples/universal && npm run build:prerender"
    }

    stage('npm test') {
        sh "npm run test:ci"
    }

    stage('npm e2e') {
        sh "npm run e2e:ci"
    }

    stage('npm typedoc') {
        sh "npm run docs:typedoc"
    }

    stage('npm compodoc') {
        sh "npm run docs:compodoc"
    }
}
