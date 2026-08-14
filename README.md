# CloudWatch Sentinel

CloudWatch Sentinel is an AWS security monitoring lab built to understand how cloud security events can be detected, alerted, investigated, and sent to a SIEM.

The project uses AWS CloudTrail, GuardDuty, EventBridge, SNS, and Splunk.

## 1. Project Setup

First, I created an AWS IAM user for the lab and enabled MFA. I used a single AWS region throughout the project.

I also created a GitHub repository with folders for policies, findings, incident write-ups, and screenshots.

## 2. CloudTrail and GuardDuty

I enabled AWS CloudTrail to record AWS API and account activity and configured the logs to be stored in an S3 bucket.

After that, I enabled Amazon GuardDuty to detect suspicious activity in the AWS environment.

I generated GuardDuty sample findings to verify that the detection system was working correctly.

## 3. Alerting with EventBridge and SNS

I created an SNS topic and added an email subscription for security alerts.

An EventBridge rule was then created to detect GuardDuty findings and send them to the SNS topic.

The basic flow was:

```text
GuardDuty
    ↓
EventBridge
    ↓
SNS
    ↓
Email Alert
```

## 4. Incident Simulation and Investigation

I simulated two security incidents using GuardDuty findings.

For each incident, I recorded the finding details, severity, timestamp, and finding JSON. I then analyzed whether the activity was expected or suspicious.

The incidents were documented with:

* Detection
* Investigation
* Validation
* Response plan
* MITRE ATT&CK mapping

The findings and screenshots were stored in the `findings`, `writeups`, and `screenshots` folders.

## 5. Splunk Integration

I integrated AWS security logs with Splunk using the Splunk Add-on for AWS.

CloudTrail logs were forwarded to Splunk, and GuardDuty findings were routed through AWS services such as EventBridge and SQS.

I created basic Splunk searches to analyze CloudTrail activity and GuardDuty findings.

Example:

```spl
index=aws sourcetype=aws:cloudtrail
| stats count by eventName
| sort - count
```

I also created a simple dashboard to visualize AWS security activity.

## 6. MITRE ATT&CK and Cleanup

Finally, I mapped the detected activities to relevant MITRE ATT&CK Cloud techniques and documented the mappings in the project.

After completing the lab, I removed temporary resources, disabled GuardDuty, stopped unnecessary CloudTrail logging, and deleted unused SNS/SQS resources to avoid unnecessary AWS charges.

### Architecture

```text
AWS Activity
     ↓
CloudTrail
     ↓
GuardDuty
     ↓
EventBridge
     ↓
SNS / SQS
     ↓
Email / Splunk
     ↓
Investigation
     ↓
MITRE ATT&CK Mapping
```
