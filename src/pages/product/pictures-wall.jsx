import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Upload, Icon, Modal, message} from 'antd'

import {reqDeleteImg} from '../../api'

export default class PicturesWall extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: []
    }
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }
    handleCancel = () => this.setState({previewVisible: false})
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        });
    }
    handleChange = async ({file, fileList}) => {
        if (file.status === 'done') {
            const result = file.response;
            if (result.status === 0) {
                message.success('ok');
                const {name, url} = result.data;
                file = fileList[fileList.length - 1];
                file.name = name;
                file.url = url;
            } else {
                message.error('false')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        this.setState({fileList})
    }

    componentWillMount() {
        const imgs = this.props.imgs;
        if (imgs && imgs.length > 0) {
            const fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: 'http://localhost:5000/upload/' + img,
            }))
            this.state.fileList = fileList;
        }
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    accept="image/*"
                    name='image'
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>

                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
            </div>
        );
    }
}


