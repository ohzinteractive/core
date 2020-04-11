import Input from '/Input';

class UI
{

    constructor()
    {
        this.ui_elements = [];
        this._tmp_normalized_pos = new THREE.Vector2();
        this.scene = new THREE.Scene();
        this.scene.autoUpdate = false;
        this.scene.frustumCulled = false;
    }

    add_clickable_element(elem)
    {
        this.ui_elements.push(elem);
        this.scene.add(elem.mesh);
    }
    remove_clickable_element(elem)
    {
        let index = this.ui_elements.indexOf(elem);
        if (index > -1) {
          this.ui_elements.splice(index, 1);
        }

        this.scene.remove(elem.mesh);
    }

    update()
    {
        this._tmp_normalized_pos.copy(Input.normalized_mouse_pos);
        for(let i=0; i< this.ui_elements.length; i++)
        {
            this.ui_elements[i].update(this._tmp_normalized_pos)
        }
    }

    render(renderer)
    {
        renderer.render_ui(this.scene);
    }

    clear()
    {
        this.current_clicked_element = undefined
    }

    resize()
    {
        for(let i=0; i< this.ui_elements.length; i++)
        {
            this.ui_elements[i].resize()
        }
    }



}

const ui = new UI();
module.exports = ui;
