
const Card = (props) =>{
  return(
    <div onClick={props.toggleSelected} className="card">
      <img id="photo" src={props.photo} alt="" />
      <p id="card-title">{props.name}</p>
    </div>
  )
}
export default Card;