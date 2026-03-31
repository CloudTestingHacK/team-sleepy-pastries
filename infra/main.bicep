targetScope = 'resourceGroup'
param location string = resourceGroup().location

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'ai-\${uniqueString(resourceGroup().id)}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'plan-\${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'S1'
    tier: 'Standard'
    capacity: 1
  }
}

// Web App
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'app-\${uniqueString(resourceGroup().id)}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: appInsights.properties.ConnectionString
        }
      ]
    }
  }
}

output webAppUrl string = 'https://\${webApp.properties.defaultHostName}'
output appInsightsName string = appInsights.name
