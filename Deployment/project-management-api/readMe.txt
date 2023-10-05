## Login AZ Accounts
az login --use-device-code

## Create a web app in Azure
1) Create RG
$LOCATION='eastus'
$RESOURCE_GROUP_NAME='python-flask-webapp-rg'

# Create a resource group
az group create `
    --location $LOCATION `
    --name $RESOURCE_GROUP_NAME
	
2) Create App Service Plan
$APP_SERVICE_PLAN_NAME='python-flask-webapp-plan'

az appservice plan create `
    --name $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --sku B1 `
    --is-linux
	
3) Create App service web app
$APP_SERVICE_NAME='python-flask-webapp-quicklabs'

az webapp create `
    --name $APP_SERVICE_NAME `
    --runtime 'PYTHON:3.9' `
    --plan $APP_SERVICE_PLAN_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --query 'defaultHostName' `
    --output table
	
	
4) Enable build automation.
az webapp config appsettings set `
    --resource-group $RESOURCE_GROUP_NAME `
    --name $APP_SERVICE_NAME `
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
	

5) Zip file upload.
az webapp deploy `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME `
    --type zip `
    --src-path D:\dev\Apps\"Vehicle Master"\Azure\Vehicle-Master-API.zip
	
6) Stream logs - Configuration
az webapp log config `
    --web-server-logging filesystem `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME

7) Stream the log trail
az webapp log tail `
    --name $APP_SERVICE_NAME `
    --resource-group $RESOURCE_GROUP_NAME


--------------------------------------------------------------
Pushing to azure container registry
--------------------------------------------------------------
https://stackoverflow.com/questions/47424481/docker-push-to-azure-container-registry-access-denied



DOCKER CONTAINERS
    - docker tag workload-analysis-tool-api makajubi.azurecr.io/workload-analysis-tool-api:latest
    - docker push makajubi.azurecr.io/workload-analysis-tool-api
    - docker container run --name workload-analysis-tool-api -d -p 1015:80 makajubi.azurecr.io/workload-analysis-tool-api:latest-18-09
    - docker container rm --force <containerid> (Stop and remove a running container)


    Container logs
        - docker container logs <containerid:f03fde68a26c>
        - /var/lib/docker/containers/<containerid>
        - /var/lib/docker/containers/f03fde68a26c5fea97bd8f00193639d2d10162f38a2265eea2d5d7be81098166
