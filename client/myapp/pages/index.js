import Head from 'next/head';
import File from './file';
import styles from '../styles/Home.module.css';
import { useState, useCallback } from 'react';
import MyDropzone from './dropzone';
import { Helmet } from 'react-helmet';


export default function Home() {
  const [upload, setUpload] = useState(true);
  const [fileData, setFileData] = useState([]);
  const [averages, setAverages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    const filesTemp = [];
    acceptedFiles.forEach(file => {
      filesTemp.push(file);
    });
    setFiles(filesTemp);
  }, []);

  const handleClick = () => {
    setUpload(false);
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    let scaleInputElement = document.getElementById('scaleInput');
    const scale = scaleInputElement.value;
    formData.append('scale', scale);

    fetch('http://127.0.0.1:8000/api/v1/analyze/', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        setLoading(false);
        return response.json();
      })
      .then(data => {
        setFileData(data.files);
        setAverages([data.whole_inner_average, data.whole_outer_average, data.whole_ratio_average])
        console.log(data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  }

  return (
    <>
      <Head>
        <title>File Upload</title>
      </Head>
      <div id="root" style={{
        color: "white"
      }}>
      {upload ? (
        <>
          <div className={styles.wrapper}>
            <div className={styles.centeredDropzone}>
              <div className={styles.dropzone}>
                <MyDropzone onDrop={onDrop} />
              </div>
            </div>
            <div className={styles.scale}>
              <p>Scale:</p><input type="text" id="scaleInput" /><input onClick={handleClick} type="button" value="Submit" />
            </div>
          </div>
        </>
      ) : (
        loading ? (
          <div className={styles.loading}>
            Loading...
          </div>
        ) : (
          <>
            <u><h1>Statistics of All Files</h1></u>
            <p>
              Inner average: { averages[0] } <br />
              Outer average: { averages[1] } <br />
              Ratio average: { averages[2] } <br />
            </p>
            {fileData.map((data, index) => (
              <File key={index} fileData={data} index={index} />
            ))}
            <a href="http://127.0.0.1:8000/api/v1/data_excel">
              <h2>Download the data!</h2>
            </a>
          </>
        )
      )}
      <Helmet>
        <style>{'body { background-color: rgba(0, 39, 76, 1); }'}</style>
      </Helmet>
      </div>
    </>
  );
}