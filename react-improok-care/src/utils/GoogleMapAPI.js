import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultProps = {
    center: {
        lat: 10.8166162,
        lng: 106.6759925,
    },
    zoom: 10,
};

function GoogleMapAPI(props) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyB-M500zF9hEI3OoOPyK_dVHfWDyZcx5fI",
    });

    const [coords, setCoords] = useState(defaultProps.center);
    const [address, setAddress] = useState(null);

    const getCoords = async () => {
        try {
            const results = await geocodeByAddress(props.address);
            if (results.length === 0) {
                console.log("Địa chỉ không tồn tại");
                return;
            }

            const LatLng = await getLatLng(results[0]);
            console.log("Tọa độ:", LatLng);

            // Tiếp tục xử lý logic với tọa độ địa chỉ
            console.log(results);
            console.log(LatLng);

            setCoords(LatLng);
        } catch (error) {
            console.log("Lỗi khi tìm kiếm địa chỉ:", error);
        }

    };

    useEffect(() => {
        getCoords();
    }, [props.address]);

    const handleButtonClick = () => {
        // Xử lý logic khi nút được nhấn
        getCoords();
        console.log("Đăng nhập với địa chỉ:", address);
    };

    return (
        <>
            {/* <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className="Login_Butt" onClick={handleButtonClick}>
        Đăng nhập
      </button> */}
            {isLoaded ? (
                <GoogleMap mapContainerStyle={containerStyle} center={coords} zoom={18}>
                    <Marker position={coords} />
                </GoogleMap>
            ) : null}
        </>
    );
}

export default GoogleMapAPI;