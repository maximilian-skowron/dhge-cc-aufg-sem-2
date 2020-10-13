variable "region" {
  type    = string
  default = "eu-central-1"
}

variable "ak" {
  type = string
}

variable "sk" {
  type = string
}

variable "upload-bucket-name" {
  description = "Name of the upload bucket."
  type = string
}

variable "result-bucket-name" {
  description = "Name of the upload bucket."
  type = string
}

variable "instance-type" {
  description = "Type of the vms. (t2.micro, ...)"
  type = string 
  default = "t2.micro"
}