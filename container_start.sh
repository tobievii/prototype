#!/bin/bash

declare -a pm2_params
declare -a js_params

echo "Note: Paramaters preceding '--' will be passed to PM2, others will be passed to the script"

# Loop through parameters to split them up
for i; do
   if [ "$i" = "--" ]; then
      pm2_done=1
   elif [ -z "$pm2_done" ]; then  # We are still dealing with PM2 parameters
      pm2_params+=("$i")
   else  # We are now dealing with node script parameters
      js_params+=("$i")
   fi
done

echo -n "PM2 paramaters: "
for i in "${pm2_params[@]}"; do
   echo -n "'$i' "
done
echo

echo -n "Script paramaters: "
for i in "${js_params[@]}"; do
   echo -n "'$i' "
done
echo

exec /usr/local/bin/pm2-runtime "${pm2_params[@]}" main.js "${js_params[@]}"
