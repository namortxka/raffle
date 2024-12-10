<?php

$names = ['asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg','asd','qwe','zxc','vbn','rty','dfg','wer','hkhj','lkjl','cvbc','dfg','tyuyt','zxcz','dfgdf','gghjg'];

// Set correct header for JSON
header('Content-Type: application/json');

// Return the names as a JSON response
echo json_encode($names);

?>
