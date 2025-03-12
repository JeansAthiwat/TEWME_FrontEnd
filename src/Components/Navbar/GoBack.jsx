import { useNavigate } from 'react-router-dom';

const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);  // This will take you to the previous page
  };

  return (
    // <div style={{position:"fixed",backgroundColor:"white",width:"75px",height:"75px",borderRadius:"50%",
    //     justifyContent:"center",justifyItems:"center"
    // }}>
    <div>
      <button className="fixed left-24 top-36 w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl hover:bg-white hover:text-blue-500 active:scale-110" onClick={handleGoBack}>{"←"}</button>
    </div>
  );
};

export default GoBack;