resource "aws_instance" "web" {
  ami                    = "ami-0e35ddab05955cf57"      #change ami id for different region
  instance_type          = "t2.medium"
  key_name               = "newkeyaws"              #change key name as per your setup
  vpc_security_group_ids = [aws_security_group.Jenkins-VM-SG.id]
  user_data              = templatefile("./install.sh", {})

  tags = {
    Name = "Tempcryptoinstance"
  }

  root_block_device {
    volume_size = 20
  }
}

resource "aws_security_group" "Jenkins-VM-SG" {
  name        = "Jenkins-VM-SG"
  description = "Allow TLS inbound traffic"

  ingress = [
    for port in [22, 80, 443, 8080, 9000, 3000,3190] : {
      description      = "inbound rules"
      from_port        = port
      to_port          = port
      protocol         = "tcp"
      cidr_blocks      = ["0.0.0.0/0"]
      ipv6_cidr_blocks = []
      prefix_list_ids  = []
      security_groups  = []
      self             = false
    }
  ]

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "Jenkins-VM-SG"
  }
}