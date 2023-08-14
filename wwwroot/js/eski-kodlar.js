
const txtWidthElement = document.getElementById("txt_Width");
const airwayButton = document.getElementById("airway");
const roadwayButton = document.getElementById("roadway");
const resetButton = document.getElementById("reset");
var current_button = 0;


function CalculateAirwayCost() {
    var country_code;
    current_button = 1;
    if (current_button == 1) {
        roadwayButton.style.backgroundColor = "white";
        airwayButton.style.backgroundColor = "lightgray";
    }

    if (document.querySelector('input[name="radioButton"]:checked') && document.querySelector('input[name="radioButton2"]:checked')) {
        const from = document.querySelector('input[name="radioButton"]:checked');
        if (from.value == "germany") {
            country_code = 1;
        }
        else if (from.value == "othereurope") {
            country_code = 2;
        }
        else if (from.value == "usa") {
            country_code = 4;
        }
        else if (from.value == "china") {
            country_code = 6;
        }
        var price = removeCommas(parseInt(document.getElementById("txt-Price").value, 10));//for 1000 pcs
        var pcs_weight = removeCommas(parseInt(document.getElementById("txt-weight").value, 10)); //1 pcs weight in unit of gram
        var box_width = 5;
        var box_length = 5;
        var box_height = 5;



        const default_or_custom = document.querySelector('input[name="radioButton2"]:checked');

        if (default_or_custom.value == "default") {
            box_width = 30;
            box_length = 30;
            box_height = 30;
        }
        else if (default_or_custom.value == "custom") {
            box_width = removeCommas(parseInt(document.getElementById("txt_Width").value, 10));
            box_length = removeCommas(parseInt(document.getElementById("txt_Length").value, 10));
            box_height = removeCommas(parseInt(document.getElementById("txt_height").value, 10));
        }
        else {
            box_width = 0;
            box_length = 0;
            box_height = 0;
        }

        var box_amount = removeCommas(parseInt(document.getElementById("txt_Box_Amount").value, 10));
        var amount_ina_year = removeCommas(parseInt(document.getElementById("txt_Amount_Year").value, 10));
        var frequency = removeCommas(parseInt(document.getElementById("txt_frequency").value, 10));

        // in this block we decide that which weight are we gonna use
        var total_box_weight = (pcs_weight * box_amount) / 1000; //50 gram is initial box weight , total box weight is unit of kg
        var volumetric_weight = (box_width * box_height * box_length) / 5000 //we calculated the volumetric weight 
        var weight_of_one_box;
        if (total_box_weight > volumetric_weight) {
            weight_of_one_box = total_box_weight; //gram to klogram

        }
        else if (total_box_weight <= volumetric_weight) {
            weight_of_one_box = volumetric_weight;
        }




        var cost_per_box;


        price_country_code_matrix = [
            ["kg", 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0, 16.0, 17.0, 18.0, 19.0, 20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 26.0, 27.0, 28.0, 29.0, 30.0, 40.0, 50.0, 60.0, 70.0],
            [1, 6.99, 10.80, 14.60, 18.40, 22.21, 26.02, 29.83, 33.64, 37.45, 41.26, 43.42, 45.58, 47.74, 49.90, 52.06, 54.22, 56.38, 58.54, 60.70, 62.86, 65.92, 68.98, 72.04, 75.10, 78.16, 81.22, 84.28, 87.34, 90.40, 93.46, 95.74, 98.02, 100.30, 102.58, 104.86, 107.14, 109.42, 111.70, 113.98, 116.26, 115.20, 144.00, 172.80, 201.60],
            [2, 7.04, 10.92, 14.78, 18.64, 22.51, 26.39, 30.27, 34.15, 38.03, 41.91, 44.07, 46.23, 48.39, 50.55, 52.71, 54.87, 57.03, 59.19, 61.35, 63.51, 66.57, 69.63, 72.69, 75.75, 78.81, 81.87, 84.93, 87.99, 91.05, 94.11, 96.39, 98.67, 100.95, 103.23, 105.51, 107.79, 110.07, 112.35, 114.63, 116.91, 117.20, 146.50, 175.80, 205.10],
            [3, 11.42, 16.50, 20.95, 25.40, 29.85, 34.30, 38.75, 43.20, 47.65, 52.10, 55.59, 59.08, 62.57, 66.06, 69.55, 73.04, 76.53, 80.02, 83.51, 87.00, 90.84, 94.68, 98.52, 102.36, 106.20, 110.04, 113.88, 117.72, 121.56, 125.40, 127.96, 130.52, 133.08, 135.64, 138.20, 140.76, 143.32, 145.88, 148.44, 151.00, 127.20, 159.00, 190.80, 222.60],
            [4, 10.89, 15.02, 19.15, 23.28, 27.41, 31.54, 35.67, 39.80, 43.93, 48.06, 51.73, 55.40, 59.07, 62.74, 66.41, 70.08, 73.75, 77.42, 81.09, 84.76, 88.59, 92.42, 96.25, 100.08, 103.91, 107.74, 111.57, 115.40, 119.23, 123.06, 126.89, 130.72, 134.55, 138.38, 142.21, 146.04, 149.87, 153.70, 157.53, 161.36, 171.84, 214.80, 257.76, 300.72],
            [5, 13.33, 18.02, 22.73, 27.44, 31.89, 36.34, 40.79, 45.24, 49.69, 54.14, 57.62, 61.10, 64.58, 68.06, 71.54, 75.02, 78.50, 81.98, 85.46, 88.94, 93.48, 98.02, 102.56, 107.10, 111.64, 116.18, 120.72, 125.26, 129.80, 134.34, 138.88, 143.42, 147.96, 152.50, 157.04, 161.58, 166.12, 170.66, 175.20, 179.74, 168.40, 210.50, 252.60, 294.70],
            [6, 13.64, 18.72, 23.47, 28.22, 32.98, 37.74, 42.50, 47.26, 52.02, 56.78, 60.47, 64.16, 67.85, 71.54, 75.23, 78.92, 82.61, 86.30, 89.99, 93.68, 98.76, 103.84, 108.92, 114.00, 119.08, 124.16, 129.24, 134.32, 139.40, 144.48, 149.04, 153.60, 158.16, 162.72, 167.28, 171.84, 176.40, 180.96, 185.52, 190.08, 180.40, 225.50, 270.60, 315.70],
            [7, 13.96, 19.04, 23.80, 28.56, 33.31, 38.06, 42.81, 47.56, 52.31, 57.06, 60.75, 64.44, 68.13, 71.82, 75.51, 79.20, 82.89, 86.58, 90.27, 93.96, 99.02, 104.08, 109.14, 114.20, 119.26, 124.32, 129.38, 134.44, 139.50, 144.56, 149.10, 153.64, 158.18, 162.72, 167.26, 171.80, 176.34, 180.88, 185.42, 189.96, 217.20, 271.50, 325.80, 380.10],
            [8, 14.28, 19.68, 24.44, 29.20, 33.96, 38.72, 43.48, 48.24, 53.00, 57.76, 61.57, 65.38, 69.19, 73.00, 76.81, 80.62, 84.43, 88.24, 92.05, 95.86, 100.94, 106.02, 111.10, 116.18, 121.26, 126.34, 131.42, 136.50, 141.58, 146.66, 151.22, 155.78, 160.34, 164.90, 169.46, 174.02, 178.58, 183.14, 187.70, 192.26, 224.80, 281.00, 337.20, 393.40],
            [9, 15.23, 22.21, 28.89, 35.57, 42.23, 47.63, 53.03, 58.43, 63.83, 69.23, 74.63, 80.03, 85.43, 90.83, 96.23, 101.63, 107.03, 112.43, 117.83, 123.23, 128.31, 133.39, 138.47, 143.55, 148.63, 153.71, 158.79, 163.87, 168.95, 174.03, 178.59, 183.15, 187.71, 192.27, 196.83, 201.39, 205.95, 210.51, 215.07, 219.63, 259.20, 324.00, 388.80, 453.60]

        ];



        // other europe 2
        // Germany 1
        // usa 3
        //china 5

        for (let i = 0; i < 9; i++) {

            if (price_country_code_matrix[i][0] == country_code) {
                for (let j = 1; j <= 100; j++) {
                    if (weight_of_one_box <= price_country_code_matrix[0][j]) {
                        cost_per_box = price_country_code_matrix[i][j];
                        break;
                    }
                    else if (weight_of_one_box > 70) {
                        alert("weight of 1 box can be 70kg maximum. Please rearange the product amount in one box");
                        break;
                    }
                }
            }

        }
        const amount_of_boxes_in_a_year = amount_ina_year / box_amount; //bir yıldaki toplam gecelek kutu sayısı
        const amount_of_boxes_for_one_shipment = amount_of_boxes_in_a_year / frequency; //tek bir sevkiyatta gelecek olan kutu sayısı
        const product_cost_for_one_shipment = amount_of_boxes_for_one_shipment * box_amount / 1000 * price; //tek bir sevkiyattaki ürünlere ödenen tutar
        const shipment_cost_for_one_shipment = (cost_per_box * amount_of_boxes_for_one_shipment) * 2; //tek bir sevkiyattaki sevkiyat maliyeti
        const total_cost_for_one_shipment = shipment_cost_for_one_shipment + product_cost_for_one_shipment; //bir sekiyatın bize toplam maliyeti
        const total_cost_for_one_year = total_cost_for_one_shipment * frequency; //bir yıl boyunca o ürünün tamamını getirmenin bize maliyeti


        //txtWidthElement.value = product_cost_for_one_shipment; //firs row, second column
        document.getElementById("satici_maliyet").value = product_cost_for_one_shipment;
        document.getElementById("shipment_cost").value = shipment_cost_for_one_shipment;
        document.getElementById("taxes").value = 50; //default 50 for now 
        document.getElementById("total_cost_per_shipment").value = total_cost_for_one_shipment;
        document.getElementById("total_cost_per_year").value = total_cost_for_one_year;


    }
    else {
        alert("Please Select The Country Code and Box sizes")
    }

}
window.onload = function () {
    document.getElementById("satici_maliyet").disabled = true;
    document.getElementById("shipment_cost").disabled = true;
    document.getElementById("taxes").disabled = true;
    document.getElementById("total_cost_per_shipment").disabled = true;
    document.getElementById("total_cost_per_year").disabled = true;
    document.getElementById("txt-Receiver").disabled = true;
    document.getElementById("txt-Receiver").value = "Turkey";
};

function CalculateRoadwayCost() {
    var country_code;
    current_button = 2;
    if (current_button == 2) {
        roadwayButton.style.backgroundColor = "lightgray";
        airwayButton.style.backgroundColor = "white";
    }
    if (document.querySelector('input[name="radioButton"]:checked') && document.querySelector('input[name="radioButton2"]:checked')) {
        const from = document.querySelector('input[name="radioButton"]:checked');
        if (from.value == "germany") {
            country_code = 1;
        }
        else if (from.value == "othereurope") {
            country_code = 2;
        }
        else if (from.value == "usa") {
            country_code = 4;
        }
        else if (from.value == "china") {
            country_code = 6;
        }
        var price = removeCommas(parseInt(document.getElementById("txt-Price").value, 10));//for 1000 pcs
        var pcs_weight = removeCommas(parseInt(document.getElementById("txt-weight").value, 10)); //1 pcs weight in unit of gram
        var box_width = 5;
        var box_length = 5;
        var box_height = 5;



        const default_or_custom = document.querySelector('input[name="radioButton2"]:checked');

        if (default_or_custom.value == "default") {
            box_width = 30;
            box_length = 30;
            box_height = 30;
        }
        else if (default_or_custom.value == "custom") {
            box_width = removeCommas(parseInt(document.getElementById("txt_Width").value, 10));
            box_length = removeCommas(parseInt(document.getElementById("txt_Length").value, 10));
            box_height = removeCommas(parseInt(document.getElementById("txt_height").value, 10));
        }
        else {
            box_width = 0;
            box_length = 0;
            box_height = 0;
        }

        var box_amount = removeCommas(parseInt(document.getElementById("txt_Box_Amount").value, 10));
        var amount_ina_year = removeCommas(parseInt(document.getElementById("txt_Amount_Year").value, 10));
        var frequency = removeCommas(parseInt(document.getElementById("txt_frequency").value, 10));

        // in this block we decide that which weight are we gonna use
        var total_box_weight = (pcs_weight * box_amount) / 1000; //50 gram is initial box weight , total box weight is unit of kg //gram to klogram
        var volumetric_weight = (box_width * box_height * box_length) / 5000 //we calculated the volumetric weight 
        var weight_of_one_box;
        if (total_box_weight > volumetric_weight) {
            weight_of_one_box = total_box_weight;

        }
        else if (total_box_weight <= volumetric_weight) {
            weight_of_one_box = volumetric_weight;
        }




        var cost_per_box;


        price_matrix = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            [0.15, 0.15, 0.15, 0.15, 0.13, 0.13, 0.13, 0.11, 0.11, 0.11, 0.10]
        ];



        const amount_of_boxes_in_a_year = amount_ina_year / box_amount; //bir yıldaki toplam gecelek kutu sayısı
        const amount_of_boxes_for_one_shipment = amount_of_boxes_in_a_year / frequency; //tek bir sevkiyatta gelecek olan kutu sayısı
        one_shipment_kg = weight_of_one_box * amount_of_boxes_for_one_shipment;

        for (let i = 0; i < 10; i++) {
            if (price_matrix[0][i] > one_shipment_kg) {
                price_coefficient = price_matrix[0][i];
                break; // Add this line to exit the loop
            }
        }


        const product_cost_for_one_shipment = amount_of_boxes_for_one_shipment * box_amount / 1000 * price; //tek bir sevkiyattaki ürünlere ödenen tutar
        const shipment_cost_for_one_shipment = price_coefficient * one_shipment_kg; //tek bir sevkiyattaki sevkiyat maliyeti
        const total_cost_for_one_shipment = shipment_cost_for_one_shipment + product_cost_for_one_shipment; //bir sekiyatın bize toplam maliyeti
        const total_cost_for_one_year = total_cost_for_one_shipment * frequency; //bir yıl boyunca o ürünün tamamını getirmenin bize maliyeti



        //txtWidthElement.value = product_cost_for_one_shipment; //firs row, second column
        document.getElementById("satici_maliyet").value = product_cost_for_one_shipment;
        document.getElementById("shipment_cost").value = shipment_cost_for_one_shipment;
        document.getElementById("taxes").value = 50; //default 50 for now 
        document.getElementById("total_cost_per_shipment").value = total_cost_for_one_shipment;
        document.getElementById("total_cost_per_year").value = total_cost_for_one_year;


    }
    else {
        alert("Please Select The Country Code and Box sizes")
    }


}
function ResetButton() {
    current_button = 3;
    if (current_button == 3) {
        roadwayButton.style.backgroundColor = "white";
        airwayButton.style.backgroundColor = "white";
    }
}
function removeCommas(numberWithCommas) {

    return numberWithCommas
}

function formatNumberWithCommas(input) {

}

