<?php
//============================================================+
// File name   : example_058.php
// Begin       : 2010-04-22
// Last Update : 2013-05-14
//
// Description : Example 058 for TCPDF class
//               SVG Image
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: SVG Image
 * @author Nicola Asuni
 * @since 2010-05-02
 */

// Include the main TCPDF library (search for installation path).
require_once('../tcpdf/tcpdf_import.php');

//error_reporting(E_ALL);

$name 	= $_POST['name'];
$svg	= stripcslashes($_POST['svg']);
$date 	= $_POST['datetime'];

$filename = "./outputs/".$name."_".$date.".svg";
$pdffile= "./outputs/".$name."_".$date.".pdf";
writefile($svg, $filename);
//echo K_PATH_IMAGES;
echo "outputs/".$name."_".$date.".pdf";
// print_R($_POST);

// TODO 
/*
try write folder action

*/
	



function writefile($newdata,$fname) {
	if ($newdata != "") {
		// echo "<p class=cartText>writing $fname</p>";
		$fp = fopen("$fname", "w");
		if (!fwrite ($fp, $newdata)) { 
			fclose($fp); 
			return "&fail=FAILED WRITE $fname "; 
		} else {
			return true;
			fclose($fp);
		}
	}
}    

// create new PDF document
//$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
$pdf = new TCPDF("L", PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);


// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Matthew Gardiner');
$pdf->SetTitle('ORI* T-SHIRT');
$pdf->SetSubject('Organic Folding Algorithm based on Pineapple Folding Pattern');
$pdf->SetKeywords('ORI, Matthew Gardiner, Pineapple');

// set default header data
//$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 058', PDF_HEADER_STRING);
$pdf->SetHeaderData("../images/matthewgardiner.net.png", "100", ''.'', '');

//$pdf->ImageSVG($file="images/matthewgardiner.net.svg", $x=0, $y=0, $w=500, $h=61, false, $align='center', $palign='true', $border=0, $fitonpage=false);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(FALSE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

// set font
$pdf->SetFont('helvetica', '', 10);

// add a page
$pdf->AddPage();

// NOTE: Uncomment the following line to rasterize SVG image using the ImageMagick library.
//$pdf->setRasterizeVectorImages(true);

$pdf->ImageSVG($file=$filename, $x=20, $y=10, $w=250, $h=250, false, $align='center', $palign='true', $border=0, $fitonpage=false);

$pdf->SetFont('helvetica', '', 8);
$pdf->SetY(195);
$txt = '© www.matthewgardiner.net';
$pdf->Write(0, "ORI* TSHIRT X [$name]         ©matthewgardiner.net", '', 0, 'L', true, 0, false, false, 0);

// ---------------------------------------------------------

//Close and output PDF document
$data = $pdf->Output($pdffile, 'S');
writefile($data, $pdffile);
//============================================================+
// END OF FILE
//============================================================+
