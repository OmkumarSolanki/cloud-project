variable "project_id" {
  type = string
}

variable "source_image_family" {
  type    = string
  default = "centos-stream-8"
}

variable "ssh_username" {
  type    = string
  default = "packer"
}

variable "zone" {
  type    = string
  default = "us-central1-a"
}

variable "machine_type" {
  type    = string
  default = "e2-standard-2"
}

# variable "MYSQL_USERNAME" {
#   type    = string
#   default = "root"
# }

# variable "MYSQL_PASSWORD" {
#   type = string
# }

# variable "MYSQL_DB_NAME" {
#   type    = string
#   default = "csye"
# }

# variable "TEST_MYSQL_DB_NAME" {
#   type    = string
#   default = "testdb"
# }

# variable "PORT" {
#   type    = string
#   default = "3000"
# }
