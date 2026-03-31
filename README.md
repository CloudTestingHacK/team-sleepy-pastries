# Team sleepy-pastries - MOJGHCPHack4Testers

Welcome to your team's repository! Everything is set up and ready to deploy to Azure.

---

## 🎯 Your Azure Resources

| Resource | Value |
|----------|-------|
| **Resource Group** | `rg-hack-sleepy-pastries` |
| **Location** | `ukwest` |
| **Subscription** | MOJGHCPHack4Testers |

### 🔗 Quick Links

- **[Open Resource Group in Azure Portal](https://portal.azure.com/#@f0380713-9d98-4d52-bbb0-abb7dc56c958/resource/subscriptions/d2e1eddd-6544-4763-9669-78a557c8531d/resourceGroups/rg-hack-sleepy-pastries/overview)**

---

## 🚀 How to Deploy to Azure

Your repository is configured with **automated deployment**. Here's how it works:

### Quick Deploy:

1. **Edit `infra/main.bicep`** - Add your Azure resources (examples below)
2. **Commit and push** to the `main` branch
3. **GitHub Actions automatically deploys** to Azure
4. **Check the Actions tab** to see deployment progress

---

## 📋 Deployment Examples

### Example 1: Azure Load Testing - Performance Testing

Deploy Azure Load Testing resources to test your applications under load:

```bicep
targetScope = 'resourceGroup'
param location string = resourceGroup().location
param loadTestName string = 'loadtest-\${uniqueString(resourceGroup().id)}'

// Azure Load Testing Resource
resource loadTest 'Microsoft.LoadTestService/loadTests@2022-12-01' = {
  name: loadTestName
  location: location
  properties: {
    description: 'Load testing for sleepy-pastries'
  }
}

// Storage Account for test data and results
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'stload\${uniqueString(resourceGroup().id)}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
  }
}

output loadTestId string = loadTest.id
output loadTestName string = loadTest.name
output storageAccountName string = storageAccount.name
```

### Example 2: Web App with Application Insights

Deploy a web application with monitoring for load testing:

```bicep
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
```

---

## 🔒 Authentication

Your deployments use **Azure Workload Identity (OIDC)** for secure authentication. All credentials are managed as **organization secrets** - no passwords or keys in your code!

The deployment workflow automatically uses:
- `AZURE_CLIENT_ID` - Service principal (managed by admins)
- `AZURE_TENANT_ID` - Azure AD tenant (managed by admins)
- `AZURE_SUBSCRIPTION_ID` - Target subscription (managed by admins)

**You don't need to configure anything - it just works!** ✨

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated Azure deployment
├── infra/
│   └── main.bicep              # Your infrastructure code
├── .gitignore
└── README.md                   # This file
```

---

## 🔍 Monitoring Deployments

- **GitHub Actions**: Go to the [Actions tab](../../actions) to see deployment logs
- **Azure Portal**: Use the [Resource Group link](https://portal.azure.com/#@f0380713-9d98-4d52-bbb0-abb7dc56c958/resource/subscriptions/d2e1eddd-6544-4763-9669-78a557c8531d/resourceGroups/rg-hack-sleepy-pastries/overview) to view deployed resources

---

## 🧪 Testing Resources

### Azure Testing Services

Deploy these Azure services for comprehensive testing:

- **[Azure App Testing](https://learn.microsoft.com/azure/reliability/testing-overview)** - Test your applications for reliability and performance
- **[Azure Load Testing](https://learn.microsoft.com/azure/load-testing/)** - Generate high-scale load and run load tests
- **[Azure Chaos Studio](https://learn.microsoft.com/azure/chaos-studio/)** - Improve application resilience through controlled chaos experiments
- **[Playwright Testing](https://playwright.dev/)** - End-to-end testing for web applications

### 📖 Guided Exercises

Follow these hands-on labs to get started:

1. **[Contoso Traders - Cloud Testing Lab](https://github.com/CloudTestingHacK/contosotraders-cloudtesting)**
   - **🌐 Live Demo**: The application is already deployed at [https://contoso-traders-ui2ct325c-cjddh8g4evg7esgv.z03.azurefd.net/](https://contoso-traders-ui2ct325c-cjddh8g4evg7esgv.z03.azurefd.net/)
   - **Note**: You can explore the deployed app and run tests against it directly. Deployment instructions in the repo are optional - only deploy if you want to use a different subscription.
   - Implement load testing scenarios
   - Implement functional testing with Playwright
   - Try out fault injection with Azure Chaos Studio
   - Practice cloud testing strategies

2. **[Playwright BDD Hands-On Lab](https://github.com/Gwayaboy/PlaywrightHandsOnLab?tab=readme-ov-file#exercise-2-implement-your-bdd-playwright-test)**
   - Exercise 2: Implement BDD Playwright tests
   - Learn behavior-driven development with Playwright
   - Create maintainable test automation

### 📚 Additional Resources

- [Bicep Documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
- [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates)
- [Azure Resource Reference](https://learn.microsoft.com/azure/templates/)

---

## 👥 Team Administrators

Need help? Contact:
- Dominic Batstone ([@Dominic-Batstone](https://github.com/Dominic-Batstone))
- Paromita Roy ([@Paromita-Roy](https://github.com/Paromita-Roy))
- Ian Curtis ([@iancurtis](https://github.com/iancurtis))

---

**Happy Hacking! 🚀**
