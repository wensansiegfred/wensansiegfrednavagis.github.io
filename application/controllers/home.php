<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Home extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
	public function __construct(){
        parent::__construct();
        $this->load->database();        
        $this->load->helper('url');
   }
	public function index(){
		$this->load->view('home_page');
	}

	public function getcategory(){
		$data = array();
		$sql = "select * from category";
		$query = $this->db->query($sql);
		foreach($query->result() as $row){
			$data[$row->id] = trim($row->name);
		}
		echo json_encode($data);
	}

	public function loaddefaultmaps(){
		$data = array();
		$sql = "select r.*,cv.visits from restaurant r inner join cus_visit cv on r.id = cv.res_id";
		$query = $this->db->query($sql);
		$counter = 0;
		foreach($query->result() as $row){
			$data[$counter]["id"] = $row->id;
			$data[$counter]["name"] = trim($row->name);
			$data[$counter]["lat"] = $row->lat;
			$data[$counter]["longi"] = $row->longi;
			$data[$counter]["specialty"] = trim($row->specialty);
			$data[$counter]["visits"] = $row->visits;
			$counter++;
		}
		echo json_encode($data);
	}

	public function getmapbasedonid(){
		$data = array();
		$typeid = $this->input->post("id");
		$sql = "select r.*,cv.visits from restaurant r inner join cus_visit cv on r.id = cv.res_id where cat_id = {$typeid}";
		$query = $this->db->query($sql);
		$counter = 0;
		foreach($query->result() as $row){
			$data[$counter]["id"] = $row->id;
			$data[$counter]["name"] = trim($row->name);
			$data[$counter]["lat"] = $row->lat;
			$data[$counter]["longi"] = $row->longi;
			$data[$counter]["specialty"] = trim($row->specialty);
			$data[$counter]["visits"] = $row->visits;
			$counter++;
		}
		echo json_encode($data);	
	}

	public function getrestaurant(){
		$data = array();
		$id = $this->input->post("id");
		$sql = "select r.*,cv.visits,c.jobs from restaurant r left join cus_visit cv on r.id = cv.res_id left join customer c on r.id = c.res_id where r.id = {$id}";
		
		$query = $this->db->query($sql);
		$counter = 0;
		foreach($query->result() as $row){
			$data[$counter]["id"] = $row->id;
			$data[$counter]["name"] = trim($row->name);
			$data[$counter]["lat"] = $row->lat;
			$data[$counter]["longi"] = $row->longi;
			$data[$counter]["specialty"] = trim($row->specialty);
			$data[$counter]["visits"] = $row->visits;
			$data[$counter]["jobs"] = $row->jobs;
			$sql2 = "select avg(rating) rating from rating where res_id = {$id}";
			$q = $this->db->query($sql2);
			foreach ($q->result() as $r) {
				$data[$counter]["rating"] = $r->rating;	
			}
		}

		echo json_encode($data);
	}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */