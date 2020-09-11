# Configure the AWS Provider
provider "aws" {
  version    = "~> 3.0"
  region     = var.region
  access_key = var.ak
  secret_key = var.sk
}

