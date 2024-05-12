1.  Create a new Project in GCP
2.  Enable gcloud services enable compute.googleapis.com
3.  Create a Service Account and role as Compute Instance Admin and Service Account User
    Download the key
4.  Create a folder variables under packer i.e. packer/variables
5.  create a file dev.pkrvars.hcl
6.  In Vars File add the folloeing details
    project_id =
    source_image_family =
    ssh_username =
    zone =
    machine_type =
    MYSQL_USERNAME =
    MYSQL_PASSWORD =
    MYSQL_DB_NAME =
    TEST_MYSQL_DB_NAME =
    PORT =
7.  Validate and Build Packer
    Go to packer folder and then
    packer init
    packer validate -var-file="variables/dev.pkrvars hcl" templates/.
    packer build -var-file="variables/dev.pkrvars hcl" templates/.
