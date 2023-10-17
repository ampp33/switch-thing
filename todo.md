- update create_switch function to only allow users who have enough "credit", so that this logic can't be overridden in the frontend.
- update all table updates to check that a user has enough credit first before allowing them to execute the desired action
- add proper error handling for all backend calls
- after account creation redirect them to set their username
x update switch data to include both 'type', 'material', and 'color'
x- will have to write some kind of script to migrate the existing switches to this new scheme
-- will also require updating the switch_search table trigger, switch edit, and switch view pages...
x- could probably also stand to move the actuation info to that object as well...  this could be a bit challenging, but do-able

- fix switches
-- banana split
-- Feker Bluish White
-- Sakurio/Rosélios