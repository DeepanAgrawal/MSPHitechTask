// import dependency files
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { AgGridReact } from 'ag-grid-react';
import { itemsPriceWeight, itemsCourierCharges } from 'app_assets/mockData/itemsData.js'

// import CSS files
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'app_assets/css/itemsForOrder.css'

class ItemsForOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayPackageHeadingFlag: false,
      finalPackage: [],
      packageFlag: false,
      columnDefs: [
        {
          headerName: 'Name',
          field: 'Name',
          width: 100,
          editable: false,
          checkboxSelection: true
        },
        {
          headerName: 'Price',
          field: 'Price',
          width: 100,
          editable: false,
        },
        {
          headerName: 'Weight',
          field: 'Weight',
          width: 100,
          editable: false,
        }
      ],
      rowData: [
      ]
    }
  }
  /**
* @desc react life-cycle method
* @param {null}  
* @returns  {void} 
*/
  componentDidMount() {
    this.setState({
      rowData: itemsPriceWeight
    })
  }
  /**
* @desc gets called when place order button is clicked
* @param {null}  
* @returns  {void} 
*/
  onButtonClick = () => {
    let totalPrice = 0;
    let totalWeight = 0;
    let averagePrice = 0;
    let count = 1;
    let packageArr = [];
    let obj = {};
    let equalWeights = 0;
    let numberOfPackages = 0;
    let totalPackages = [];
    const selectedNodes = this.gridApi.getSelectedNodes()
    const selectedData = selectedNodes.map(node => node.data)
    const selectedDataStringPresentation = selectedData.map((node) => {
      totalPrice += parseInt(node.Price)
      totalWeight += parseInt(node.Weight)
    })
    let remainingPrice = totalPrice;
    let remainingWeight = totalWeight;
    if (totalPrice > 250) {
      let packageFlag = false;
      for (let i = 0; i < selectedData.length; i++) {
        if (selectedData[i].Price > 125) {
          packageFlag = true;
        }
        else {
          packageFlag = false;
          break
        }
      }
      if (packageFlag) {
        numberOfPackages = selectedData.length;
      }
      else {
        numberOfPackages = Math.ceil(totalPrice / 250);
      }
      equalWeights = Math.round(totalWeight / numberOfPackages) + 10;
      this.setState({
        packageFlag: packageFlag
      })
    } else {
      numberOfPackages = 1
      equalWeights = totalWeight
    }
    let descSortedWeights = selectedData.sort(function (a, b) { return b.Price - a.Price })
    averagePrice = Math.ceil(totalPrice / numberOfPackages);
    let package2 = this.packageDetails(numberOfPackages, selectedData, equalWeights, remainingPrice, remainingWeight, averagePrice);
    this.setState({
      finalPackage: package2,
      displayPackageHeadingFlag: true
    }, function () {
    })
  }
  /**
* @desc calls internally by button click function and processed the input params data and return an array with all the packages
* @param {number} numberOfPackages
* @param {array} selectedData
* @param {number} equalWeights
* @param {number} remainingPrice
* @param {number} remainingWeight
* @param {number} averagePrice
* @returns {array} finalPackage
*/
  packageDetails(numberOfPackages, selectedData, equalWeights, remainingPrice, remainingWeight, averagePrice) {
    let package2 = [];
    let finalPackage = [];
    let RemovedPackage = [];
    let advantagePrice = 250 - averagePrice;
    if (this.state.packageFlag) {
      for (let i = 0; i < numberOfPackages; i++) {
        finalPackage.push(selectedData[i]);
      }
    }
    else {
      for (let i = 0; i < numberOfPackages; i++) {
        let package1 = [];
        let packagePrices = 0;
        let packageWeight = 0;
        let updatedArray = selectedData.filter(x => !RemovedPackage.filter(y => y.Name === x.Name).length);
        for (let j = 0; j < updatedArray.length; j++) {
          packagePrices += parseInt(updatedArray[j].Price);
          packageWeight += parseInt(updatedArray[j].Weight);
          if (i !== numberOfPackages - 1) {
            if (packagePrices <= 250) {
              remainingPrice -= parseInt(updatedArray[j].Price);
              remainingWeight -= parseInt(updatedArray[j].Weight);
              if (remainingPrice > (averagePrice - advantagePrice)) {
                package1.push(updatedArray[j]);
              }
              else {
                remainingPrice += parseInt(updatedArray[j].Price);
                remainingWeight += parseInt(updatedArray[j].Weight);
                packagePrices -= parseInt(updatedArray[j].Price);
                packageWeight -= parseInt(updatedArray[j].Weight);
              }
            }
            else {
              packagePrices -= parseInt(updatedArray[j].Price);
              packageWeight -= parseInt(updatedArray[j].Weight);
            }
          }
          else {
            package1.push(updatedArray[j]);
          }
        }
        package2 = JSON.parse(JSON.stringify(package1));
        for (let x in package1) {
          RemovedPackage.push(package1[x]);
        }
        finalPackage.push(package2);
      }
    }
    return finalPackage;
  }
  render() {
    return (
      <div>
        <div className={"heading"}>
          <header>
            <h2>Items List</h2>
          </header>
        </div>
        <div className={"col-md-12 form-inline"}>
          <div id="myGrid" style={{ height: '500px', width: '300px' }} className="ag-theme-blue gridPosition col-md-2 backgrndCol">
            <AgGridReact
              rowSelection="multiple"
              columnDefs={this.state.columnDefs}
              rowData={this.state.rowData}
              onGridReady={params => this.gridApi = params.api}
              >
            </AgGridReact>
          </div>
          <div className="col-md-4">
            {this.state.displayPackageHeadingFlag ? <h3>Packages</h3> : null}
            {
              function () {
                if (this.state.finalPackage.length > 0) {
                  let displayPackages = "";
                  for (let a = 0; a < this.state.finalPackage.length; a++) {
                    let packageName = "package_" + a
                    let items = "";
                    let packageTotalPrice = 0;
                    let packageTotalWeight = 0;
                    for (let b = 0; b < this.state.finalPackage[a].length; b++) {
                      items += this.state.finalPackage[a][b].Name + " "
                      packageTotalPrice += parseInt(this.state.finalPackage[a][b].Price)
                      packageTotalWeight += parseInt(this.state.finalPackage[a][b].Weight)
                    }
                    displayPackages += packageName + " contains" + " : "
                      + "items :" + items
                      + "Total Price :" + packageTotalPrice
                      + "Total Weight :" + packageTotalWeight + "\n"
                  }
                  return (
                    <span>
                      {displayPackages}
                    </span>
                  )
                }
              }.call(this)}
          </div>
        </div>
        <div className={"col-md-2 btnStyle"}>
          <button className={"btn btn-primary float-right"} onClick={this.onButtonClick}>Place Order</button>
        </div>
      </div>
    )
  }
}

export default (ItemsForOrder);
