import { Component, ChangeEvent, useState } from "react";

import { Alert, Button } from 'react-bootstrap';
import FoodService from "../services/FoodService";
import { Food, FoodInstruction, InstructionStep, InstructionEquipment, MissedIngredient } from "../types/Food";

type Props = {};

type State = {
  recipets: Array<Food>,
  currentInstruction: Array<FoodInstruction> | null,
  currentIndex: number,
  searchTitle: string,
  hasError: boolean
};

function AlertDismissibleExample() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error with connection!</Alert.Heading>
        <p>
        Retrieving information from storage, if it exists for the request.
        </p>
      </Alert>
    );
  }
  return <Button onClick={() => setShow(true)}>Show Alert</Button>;
}

export default class FoodsList extends Component<Props, State>{
  constructor(props: Props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveFoods = this.retrieveFoods.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.removeAllRecipets = this.removeAllRecipets.bind(this);
    this.setActiveRecipet = this.setActiveRecipet.bind(this);

    this.state = {
      recipets: [],
      currentInstruction: null,
      currentIndex: -1,
      searchTitle: "apples,+flour,+sugar&number=2",
      hasError: false,
    };
  }

  componentDidMount() {
    this.retrieveFoods();
  }

  onChangeSearchTitle(e: ChangeEvent<HTMLInputElement>) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveFoods() {
    FoodService.getIngredients("", 2)
      .then((response: any) => {
        this.setState({
          recipets: response
        });
        console.log(response);
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveFoods();
    this.setState({
      currentInstruction: null,
      currentIndex: -1,
      hasError: false
    });
  }

  searchTitle() {
    this.setState({
      currentInstruction: null,
      currentIndex: -1,
      hasError: false
    });
    //"apples,+flour,+sugar"

    // TODO: check inet connection

    FoodService.getIngredients(this.state.searchTitle, 10)
      .then((response: any) => {
        this.setState({
          recipets: response
        });
        console.log(response);

        // todo: add to local storage
        localStorage.setItem(this.state.searchTitle, JSON.stringify(response))
      })
      .catch((e: Error) => {
        this.setState({
          hasError: true
        });
        console.log(e);

        var val = JSON.parse(localStorage.getItem(this.state.searchTitle) || "")
        if (val !== "") {
          this.setState({
            recipets: val
          });
        }

        // get from storage if there is an error

      });
  }

  setActiveRecipet(recipet: Food, index: number) {
    this.setState({
      hasError: false,
      currentInstruction: null,
    });

    FoodService.getAnalyzedRecipeInstructions(recipet.id)
      .then((response: any) => {
        this.setState({
          currentInstruction: response,
          currentIndex: index
        });
        console.log(response);
         // todo: add to local storage
         localStorage.setItem(this.state.searchTitle+"--instructions", JSON.stringify(response))
      })
      .catch((e: Error) => {
        this.setState({
          hasError: true
        });
        
        console.log(e);
        var val = JSON.parse(localStorage.getItem(this.state.searchTitle+"--instructions") || "")
        if (val !== "") {
          this.setState({
            currentInstruction: val,
            currentIndex: index
            
          });
        }

      });
  }

  removeAllRecipets() {
    this.setState({
      recipets: [],
      currentInstruction: [],
      currentIndex: -1,
      hasError: false
    });
  }

  render() {
    const { searchTitle, recipets, currentInstruction, currentIndex, hasError } = this.state;

    return (
      <div className="list row">
        <div className="col-md-12">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
          <h4>Recipets List</h4>
        </div>

        <div className="col-md-6">

          <ul className="list-group">
            {recipets &&
              recipets.map((recipet: Food, index: number) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveRecipet(recipet, index)}
                  key={index}
                >
                  <h2 style={{ color: "black" }}>{recipet.title}</h2>
                  <img src={recipet.image} alt="" />
                  <h5 style={{ color: "black" }}>Edditional ingredients you need:
                  </h5>

                  {recipet.missedIngredients && recipet.missedIngredients.map((missedIngredient: MissedIngredient, missedIngredientIndex: number) => (
                      <li className="list-group-item "
                      key={missedIngredientIndex}>
                      <h5 style={{ color: "black" }}>{missedIngredient.original}</h5>
                    </li>
                  ))}
                </li>
              ))}
          </ul>
        </div>

        <div className="col-md-6">
          <ul className="list-group">
            {currentInstruction && currentInstruction.map((instruction: FoodInstruction, instructionIndex: number) => (
              
                instruction && instruction.steps.map((step: InstructionStep, stepIndex: number) => (

                  <li
                      className={"list-group-item"}
                      key={stepIndex}>
                      <h3 style={{ color: "black" }}>{step.step}</h3>
                     
                    </li>
                  /*step && step.equipment.map((equipment: InstructionEquipment, equipmentIndex: number) => (
                    <li
                      className={"list-group-item"}
                      key={equipmentIndex}>
                      <h3 style={{ color: "black" }}>{equipment.name}</h3>
                      <img src={equipment.image} alt="" />
                    </li>
                  )) */
                ))
              ))}
          </ul>
        </div>

        <div className="col-md-12">
          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllRecipets}>
            Remove All
          </button>
        </div>
        
        <div className="col-md-12">
        {hasError &&<AlertDismissibleExample/>}
        </div>
      </div>
    );
  }
}