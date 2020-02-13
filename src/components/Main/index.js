import React, { useRef, useState, useEffect } from "react";
import "./styles.scss";
import {
  Container,
  Button,
  Card,
  CardText,
  CardBody,
  CardSubtitle,
  Row,
  Col,
  Input
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
  const [fileBoxText, setFileBoxText] = useState("");

  const imageToCanvas = () => {
    if (!imgRef) {
      return;
    }

    canvasRef.current.width = imgRef.current.width;
    canvasRef.current.height = imgRef.current.height;

    const ctx = canvasRef.current.getContext("2d");

    ctx.drawImage(imgRef.current, 0, 0);

    //console.log(innerWidth + ", " + innerHeight);
  };

  const onChangeText = e => {};

  const handleMouseCanvas = e => {
    try {
      // 캔버스 컨텍스트가 없다면 실행 종료
      if (!ctx) {
        return;
      }

      const { x, y } = getMousePosFromCanvas(canvasRef.current, e);

      const wid =
        imgRef.current.width > window.innerWidth * 0.7
          ? window.innerWidth * 0.7
          : imgRef.current.width;

      const ratio = imgRef.current.width / wid;

      //console.log(window.innerWidth * 0.7);
      //console.log(canvasRef.current.width);
      //console.log("x : " + x * ratio + ", y : " + y * ratio);

      //console.log(x + " / " + wid + " * " + imgRef.current.width);
      //console.log((x / wid) * imgRef.current.width);

      if (!imgRef || x * ratio < 0 || y * ratio < 0) {
        return;
      }

      const p = ctx.getImageData(x * ratio, y * ratio, 1, 1).data;

      // p 값 체크
      if (p == null || p.length < 4) {
        throw new Error("Failed to fetch image data.");
      }

      // 히든 값 위치 값 변경
      setColorBlockHidden(p[3] === 0);
      setColorBlockPos({ x: e.pageX, y: e.pageY });

      // 헥스값 변경
      setHex("#" + rgbToHex([p[0], p[1], p[2]]));
      setR(p[0]);
      setG(p[1]);
      setB(p[2]);
    } catch (e) {}
  };

  const openFileDialog = () => {
    //console.log(fileSelector);
    fileSelector.click();

    //console.log(fileSelector.re);
  };

  useEffect(() => {
    setCtx(canvasRef.current.getContext("2d"));
    const fileSelector = document.createElement("input");
    fileSelector.type = "file";
    fileSelector.onchange = e => {
      //console.log(URL.createObjectURL(e.target.files[0]));
      if (e.target.files.length <= 0) {
        setFileBoxText("");
        return;
      }

      setFile(URL.createObjectURL(e.target.files[0]));
      //URL.create;
      setFileBoxText(URL.createObjectURL(e.target.files[0]));
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
    colorBlockRef.current.style.top = `${y - 50}px`;
  }, [colorBlockPos]);

  useEffect(() => {
    colorBlockRef.current.style.visibility = colorBlockHidden
      ? "hidden"
      : "visible";
  }, [colorBlockHidden]);

  return (
    <Container className="main-container">
      <div className="head-space"></div>
      <div className="title animated fadeOutLeft text-center">
        I M A G E <br /> C R O P P E R
      </div>
      <Row className="input-form">
        <Col>
          <Input
            value={fileBoxText}
            type="text"
            className="rounded shadow"
            onClick={openFileDialog}
            onChange={onChangeText}
          />
        </Col>
      </Row>
      <img className="img-space" ref={imgRef} src={file} />
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
        width="0"
        height="0"
        className="canvas-form"
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
