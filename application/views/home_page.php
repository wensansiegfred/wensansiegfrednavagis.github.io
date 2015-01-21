<!DOCTYPE html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">	
	<title>GOOGLE MAP</title>	
	<script type="text/javascript" src="<?php echo base_url();?>assets/dashboard/js/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAilnwFUzi7agdtF5mOcFq1nS2up1LkB3w"></script>
	<script type="text/javascript" src="<?php echo base_url();?>assets/js/scripts.js"></script>
	<link type="text/css" rel="stylesheet" href="<?php echo base_url();?>assets/css/styles.css">	
</head>
<body>
	<div id="container">
		<div class="div_left left">
			<div class="my_panel">
				<div class="title"><span>Restaurant List:</span></div>
				<div class="menu_contents">
					<div class="category">
						Type:
						<select class="select_category">
							<option value="-1">--Select All--</option>
						</select>
					</div>
					<div class="res_list hide">
						Restaurant:
						<select class="select_restaurant">
							<option value="-1">--Select Restaurant--</option>
						</select>
					</div>					
				</div>
			</div>
			<div class="restaurant_detail hide"></div>
		</div>
		<div class="div_right left">
			<div id="mycontent"></div>
		</div>
	</div>
</body>
</html>
	
	
	
	
	
		
	