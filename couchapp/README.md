# MSP Transit

## Use case

Dude in MSP wants to know when the next bus is coming.  All he wants is to open an app, and see a list of results.

* Get user's location
* find the closest stop to the user
* find the routes that go to that stop
* Use the stop & route (& direction?) to ping NexTrip for real-time update
* display the results

## Make the user process as simple as possible


route=[route_short_name]
direction=[
  1 = NORTHBOUND
  2 = EASTBOUND
  3 = WESTBOUND
  4 = SOUTHBOUND]
stop=[]