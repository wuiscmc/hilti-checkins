# hilti-checkins

Simple web app that displays a counter to show the number of checkins in the current pass.

## Frontend
VanillaJS app that shows the counter. 

#### Flow
Every 10 minutes:
1. Retrieves identity pool credentials (Cognito)
2. Calls lambda that checks for the number of checkins in the system
3. Displays the counter and a countdown to see how long until the next poll. 

## Backend
Lambda function that contacts Gymcontrol's API, parses the XML response and transforms it into JSON. 
Finally, it looks for a pass in a given time period (now) and returns it. 
