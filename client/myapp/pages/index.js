import Head from 'next/head';
import File from './file';
import styles from '../styles/Home.module.css';
import { useState, useCallback } from 'react';
import MyDropzone from './dropzone';
import {Helmet} from 'react-helmet';

export default function Home() {
  const [scale, setScale] = useState(0);
  const [upload, setUpload] = useState(true);
  const [fileData, setFileData] = useState({});


  const onDrop = useCallback(acceptedFiles => {
    try {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);
      formData.append('scale', parseInt(scale));
      fetch('http://127.0.0.1:8000/api/v1/analyze/', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      }).then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      }).then((data) => {
        setUpload(false);
        setFileData(data);
      });
      
    } catch(error) {
      console.error('Error uploading file:', error);
    }
  });

  return (
    <>
        <div id="root"></div>
        {upload ? (
          <div className={styles.centeredDropzone}>
            <div className={styles.dropzone}>
              <MyDropzone  onDrop={onDrop} />
            </div>
          </div>
        ) : (
          <File fileData={fileData} />
        )}
      <Helmet>
        <style>{'body { background-color: rgba(0, 39, 76, 1); }'}</style>
      </Helmet>
    </>
  );
}