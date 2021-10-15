provider "aws" {
  region = "us-east-2"
  profile = "default"
}
#lambda
data "archive_file" "lambda_api" {  
    type = "zip"
    source_dir  = "${path.module}/dist"  
    output_path = "${path.module}/dist.zip"
    
}


resource "aws_lambda_function" "Lambda_api" {  
    function_name = "Lambda-api"

    filename = "dist.zip"

    runtime = "nodejs12.x"  
    handler = "index.js"
    
    role = aws_iam_role.lambda_exec.arn
}


resource "aws_iam_role" "lambda_exec" {
    name = "role_lambda"

      assume_role_policy = jsonencode({
          Version = "2012-10-17"
          Statement = [{
               Action = "sts:AssumeRole"
               Effect = "Allow"
               Sid    = ""
               Principal = {
                    Service = "lambda.amazonaws.com"
               }
            }
        ]
    })
}




#api gateway
resource "aws_api_gateway_rest_api" "lambda_api_gateway" {
  name = "Lamba_apiGateway"
}

resource "aws_api_gateway_resource" "resource" {
  path_part   = "resource"
  parent_id   = aws_api_gateway_rest_api.lambda_api_gateway.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.lambda_api_gateway.id
}

resource "aws_api_gateway_method" "method" {
  rest_api_id      = aws_api_gateway_rest_api.lambda_api_gateway.id
  resource_id      = aws_api_gateway_resource.resource.id
  http_method      = "GET"
  authorization    = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.lambda_api_gateway.id
  resource_id             = aws_api_gateway_resource.resource.id
  http_method             = "GET"
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.Lambda_api.invoke_arn
}





#queues
resource "aws_sqs_queue" "example_queue" {
  name = "main_queue"
}

resource "aws_sqs_queue" "dead_letter_queue" {
  name = "dead_letter_queue"
}

