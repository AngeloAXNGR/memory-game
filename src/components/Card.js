
const Card = (props) =>{
  return(
    <div onClick={props.toggleSelected} className="card">
      <img id="photo" src={props.photo} alt="" />
      <h1>{props.name}</h1>
    </div>
  )
}
export default Card;