import "../Styles/Header.css";
import { Link } from "@mui/material";
import { Button } from "@mui/material";
import {makeStyles} from "@mui/styles";
import launch_btn from '../Images/launch_btn.png' // Import using relative path

const Style = {
    edit : {
        textDecoration :'none',
        color : "white",
    }
}
const Style2 = {
    launch : {
        letterSpacing :"2px",
        fontSize : "35px",
        color:"white",
        outline : "none",
        fontWeight : "bold",
        margin : "20px",
        borderRadius:"50px",
        width: "220px",
        height: "100px",
        backgroundImage : `url(${launch_btn})`,
        backgroundPosition : "center",
        backgroundSize : "cover",
        transition : "transform 0.3s",
        "&:hover":{
            transform : "scale(1.1)",
            filter: "brightness(80%)"
        }
    }
}
const useStyle = makeStyles(Style)
const useStyle2 = makeStyles(Style2);

function Header(){
    const classe_deux = useStyle();
    const classes = useStyle2();
    return(
        <div className = "head">
            <Button className={classes.launch}><Link href = "https://discord.gg/mwP3nFp2dg" target="_blank" rel="noopener" className = {classe_deux.edit} >Discord</Link></Button>
            <Button className={classes.launch}><Link href = "https://twitter.com/KrimoKims" target="_blank" rel="noopener" className = {classe_deux.edit} >Twitter</Link></Button>
        </div>
    )
}
export default Header;