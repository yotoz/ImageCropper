import React, { useRef, useState, useEffect } from "react";
import "./styles.scss";
import {
  Container,
  Button,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Row,
  Col,
  Input,
  Label
} from "reactstrap";

const rgbToHex = function(rgbArr) {
  let hex = "";
  for (let i = 0; i < rgbArr.length; i++) {
    const hexStr = Number(rgbArr[i]).toString(16);
    hex += hexStr.length < 2 ? "0" + hexStr : hexStr;
  }
  return hex;
};

const getMousePosFromCanvas = (canvas, evt) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};

const Main = () => {
  const imgRef = useRef();
  const canvasRef = useRef();
  const colorBlockRef = useRef();

  const [ctx, setCtx] = useState(null);
  const [hex, setHex] = useState("#000000");
  const [r, setR] = useState("");
  const [g, setG] = useState("");
  const [b, setB] = useState("");
  const [file, setFile] = useState(null);
  const [fileSelector, setFileSelector] = useState(null);
  const [colorBlockHidden, setColorBlockHidden] = useState(true);
  const [colorBlockPos, setColorBlockPos] = useState({ x: 0, y: 0 });

  const imageToCanvas = () => {
    canvasRef.current.width = imgRef.current.width;
    canvasRef.current.height = imgRef.current.height;

    const ctx = canvasRef.current.getContext("2d");
    ctx.drawImage(imgRef.current, 0, 0);
  };

  const handleMouseCanvas = e => {
    if (!ctx) {
      return;
    }

    const { x, y } = getMousePosFromCanvas(canvasRef.current, e);
    const p = ctx.getImageData(x, y, 1, 1).data;

    try {
      if (p[3] == 0) {
        setColorBlockHidden(true);
      } else {
        setColorBlockHidden(false);
      }
    } catch (e) {}

    setColorBlockPos({ x: e.clientX, y: e.clientY });
    setHex("#" + rgbToHex([p[0], p[1], p[2]]));
    setR(p[0]);
    setG(p[1]);
    setB(p[2]);
  };

  const openFileDialog = () => {
    //console.log(fileSelector);
    fileSelector.click();

    console.log(fileSelector.re);
  };

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
    const fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.onchange = e => {
      console.log(URL.createObjectURL(e.target.files[0]));
      setFile(URL.createObjectURL(e.target.files[0]));

      //URL.create;
    };

    setFileSelector(fileSelector);
  }, []);

  useEffect(() => {
    colorBlockRef.current.style.backgroundColor = hex;
    //console.log(hex);
  }, [hex]);

  useEffect(() => {
    const { x, y } = colorBlockPos;

    colorBlockRef.current.style.left = `${x + 20}px`;
    colorBlockRef.current.style.top = `${y - 60}px`;
  }, [colorBlockPos]);

  useEffect(() => {
    colorBlockRef.current.style.visibility = colorBlockHidden
      ? "hidden"
      : "visible";
  }, [colorBlockHidden]);

  return (
    <Container className="main-container">
      <div className="title animated fadeOutLeft">I M A G E</div>
      <Row className="input-form">
        <Col>
          <Input
            type="text"
            className="rounded shadow"
            onClick={openFileDialog}
          />
        </Col>
      </Row>
      <hr />
      <img ref={imgRef} src={file} />
      <br />
      <Button
        color="white"
        className="rounded shadow font-weight-bold convert-btn"
        onClick={imageToCanvas}
      >
        CONVERT
      </Button>
      <br />
      <canvas
        onMouseMove={handleMouseCanvas}
        onMouseOver={() => {
          if (colorBlockHidden) {
            if (canvasRef.current.getContext.img != null) {
              setColorBlockHidden(false);
            } else {
              setColorBlockHidden(true);
            }
          }
        }}
        onMouseLeave={() => {
          if (!colorBlockHidden) {
            setColorBlockHidden(true);
          }
        }}
        ref={canvasRef}
      ></canvas>
      <div className="color-block" ref={colorBlockRef}>
        <Card className="card">
          <CardBody className="card-body">
            <CardSubtitle>Hex Details</CardSubtitle>
            <CardText>Hex : {hex}</CardText>
            <CardSubtitle>RGB Details</CardSubtitle>
            <CardText>
              R : {r}
              <br />G : {g}
              <br />B : {b}
            </CardText>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export default Main;
