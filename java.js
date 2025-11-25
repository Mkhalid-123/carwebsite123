let btn=document.querySelector("#firstbtn");
window.addEventListener('scroll',function(){
if(scrollY>400){
    btn.style.display="block";
}else{
     btn.style.display="none";
}
})