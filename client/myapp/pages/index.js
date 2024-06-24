import Head from 'next/head';
import File from './file';
import styles from '../styles/Home.module.css';
import { useState, useCallback } from 'react';
import MyDropzone from './dropzone';
import { Helmet } from 'react-helmet';


export default function Home() {
  const [upload, setUpload] = useState(true);
  const [fileData, setFileData] = useState([]);
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
        setFileData(data);
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
      <div id="root"></div>
      {upload ? (
        <>
          <div className={styles.wrapper}>
            <div className={styles.centeredDropzone}>
              <div className={styles.dropzone}>
                <MyDropzone onDrop={onDrop} />
              </div>
            </div>
            <div className={styles.scale}>
              <p>Scale:</p><input type="text" id="scaleInput" /><button onClick={handleClick}>Analyze!</button>
            </div>
          </div>
        </>
      ) : (
        loading ? (
          <div className={styles.loading}>
            Loading...
          </div>
        ) : (
          fileData.map((data, index) => (
            <File key={index} fileData={data} index={index} />
          ))
        )
      )}
      <Helmet>
        <style>{'body { background-color: rgba(0, 39, 76, 1); }'}</style>
      </Helmet>
    </>
  );
}