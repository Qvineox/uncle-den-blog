import {Fragment} from "react";
import {Dropdown} from "react-bootstrap";
import {ACTIONS} from "../blocks";
import {createPost} from "./scripts/postHandlers";


export default function EditorPanel({articleId, requestRefresh}) {
    function handlePost({action}) {
        let newPost = {
            type: action,
            content: {}
        }

        switch (action) {
            case ACTIONS.ADD_TEXT_BLOCK:
                newPost.content = {
                    description: "Описание отсутствует.",
                }

                break
            case ACTIONS.ADD_MAP_BLOCK:
                newPost.content = {
                    zoom: 5,
                    center: {lat: 0, lng: 0},
                    markers: []
                }

                break
            case ACTIONS.ADD_MAP_HELPER_BLOCK:
                newPost.content = {
                    markers: []
                }

                break
            case ACTIONS.ADD_LINK_BLOCK:
                newPost.content = {
                    link: "#",
                    image: '/assets/images/600x200-placeholder.png',
                    title: "Заголовок отсутствует.",
                    description: "Описание отсутствует.",
                }

                break
            case ACTIONS.ADD_ACCORDION_BLOCK:
                newPost.content = {
                    accordionItems: [
                        {
                            title: 'Новый заголовок 1',
                            description: 'Новое описание 2'
                        },
                    ]
                }

                break
            case ACTIONS.ADD_CAROUSEL_BLOCK:
                newPost.content = {
                    carouselItems: [
                        {
                            title: 'Новый заголовок 1',
                            description: 'Новое описание 2',
                            image: '/assets/images/1600x600-placeholder.png',
                            interval: 5000
                        },
                        {
                            title: 'Новый заголовок 2',
                            description: 'Новое описание 2',
                            image: '/assets/images/1600x600-placeholder.png',
                            interval: 5000
                        },
                    ]
                }

                break
            default:
                return null
        }

        createPost(newPost.type, newPost.content, articleId)
        requestRefresh()
    }

    return (
        <Fragment>
            <div className={"admin editor-panel"}>
                <Dropdown>
                    <Dropdown.Toggle variant={"outline-dark"} id="dropdown-basic">
                        <b>Добавить новый блок</b>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => handlePost({action: ACTIONS.ADD_TEXT_BLOCK})}>Текст</Dropdown.Item>
                        <Dropdown.Item disabled>Изображение</Dropdown.Item>
                        <Dropdown.Item disabled>Группа изображений</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item
                            onClick={() => handlePost({action: ACTIONS.ADD_MAP_BLOCK})}>Карта</Dropdown.Item>
                        <Dropdown.Item onClick={() => handlePost({action: ACTIONS.ADD_MAP_HELPER_BLOCK})}>Карта
                            с
                            подсказками</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item
                            onClick={() => handlePost({action: ACTIONS.ADD_ACCORDION_BLOCK})}>Аккордион</Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => handlePost({action: ACTIONS.ADD_CAROUSEL_BLOCK})}>Карусель</Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item
                            onClick={() => handlePost({action: ACTIONS.ADD_LINK_BLOCK})}>Ссылка</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                {/*<Button onClick={() => setShowMapEditor(true)} variant={"outline-dark"}><b>Редактировать*/}
                {/*    карту</b></Button>*/}

                {/*<Button variant={"outline-success"}><b>Сохранить</b></Button>*/}

                {/*<Button variant={"outline-danger"}><b>Отменить</b></Button>*/}
            </div>
        </Fragment>
    )
}