node('') {
    stage 'Checkout'
        checkout scm
    stage 'Build'
        sh "docker build -t qlan-app:local-latest -f Dockerfile ."
    stage 'Deploy'
        sh "docker-compose -f compose-file.yaml down -v"
        sh "docker-compose -f compose-file.yaml up -d"
}
