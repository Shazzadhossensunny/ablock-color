import { useState } from "react";
import {
  SortableContainer,
  SortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import { arrayMoveImmutable } from "array-move";
import {
  Ellipsis,
  Palette,
  GripVertical,
  Pencil,
  Copy,
  Trash2,
  SearchIcon,
  Plus,
} from "lucide-react";

const DragHandle = sortableHandle(() => (
  <span className="kzui-color-item__drag-handle">
    <GripVertical size={16} />
  </span>
));

const initialColors = [
  { id: 1, title: "Primary", color: "#1568ED", isDefault: true },
  { id: 2, title: "Secondary", color: "#ED1976", isDefault: true },
  { id: 3, title: "Title Text", color: "#000000", isDefault: true },
  { id: 4, title: "Supporting Text", color: "#595959", isDefault: true },
];

const SortableItem = SortableElement(
  ({
    color,
    onEdit,
    onDuplicate,
    onDelete,
    onSelect,
    isSelected,
    showMenu,
    onToggleMenu,
    isToggled,
    onToggleCheckbox,
  }) => (
    <div className="kzui-border__bottom">
      <li
        className={`kzui-color-item ${
          isSelected ? "kzui-color-item--selected" : ""
        }`}
        onClick={() => onToggleCheckbox(color.id)}
      >
        <div className="kzui-color-item__content">
          <DragHandle />
          {isToggled ? (
            <input
              type="checkbox"
              className="kzui-color-item__checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onSelect(color.id)}
            />
          ) : (
            <Palette size={20} />
          )}
          <span className="kzui-color-item__title">{color.title}</span>
        </div>
        <div className="kzui-value-box">
          <span
            className="kzui-color-item__color-icon"
            style={{ backgroundColor: color.color }}
          ></span>
          <span className="kzui-color-item__value">{color.color}</span>
        </div>
        <div className="kzui-color-item__actions">
          <button
            className="kzui-color-item__menu-button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu(color.id);
            }}
          >
            <Ellipsis size={20} />
          </button>
          {showMenu && (
            <div className="kzui-color-item__menu">
              <button onClick={() => onEdit(color)}>
                <Pencil size={16} />
                Edit
              </button>
              <button onClick={() => onDuplicate(color)}>
                <Copy size={16} />
                Duplicate
              </button>
              <button
                onClick={() => onDelete(color.id)}
                disabled={color.isDefault}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      </li>
    </div>
  )
);

const SortableList = SortableContainer(
  ({
    colors,
    onEdit,
    onDuplicate,
    onDelete,
    selectedItems,
    onSelect,
    activeMenu,
    onToggleMenu,
  }) => {
    const [toggledItems, setToggledItems] = useState([]);

    const handleToggleCheckbox = (id) => {
      setToggledItems((prevToggled) =>
        prevToggled.includes(id)
          ? prevToggled.filter((item) => item !== id)
          : [...prevToggled, id]
      );
    };

    return (
      <ul className="kzui-color-list">
        {colors.map((color, index) => (
          <SortableItem
            key={`item-${color.id}`}
            index={index}
            color={color}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onSelect={onSelect}
            isSelected={selectedItems.includes(color.id)}
            showMenu={activeMenu === color.id}
            onToggleMenu={onToggleMenu}
            isToggled={toggledItems.includes(color.id)}
            onToggleCheckbox={handleToggleCheckbox}
          />
        ))}
      </ul>
    );
  }
);

export default function DesignSystem() {
  const [colors, setColors] = useState(initialColors);
  const [editingColor, setEditingColor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("color");

  const handleSelect = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleAddColor = () => {
    setEditingColor({ id: Date.now(), title: "", color: "#000000" });
    setIsDrawerOpen(true);
  };

  const handleEditColor = (color) => {
    setEditingColor(color);
    setIsDrawerOpen(true);
  };

  const handleDuplicateColor = (color) => {
    const newColor = {
      ...color,
      id: Date.now(),
      title: `${color.title} Copy`,
      isDefault: false,
    };
    setColors([...colors, newColor]);
  };

  const handleDeleteColor = (id) => {
    setColors(colors.filter((color) => color.id !== id));
  };

  const handleSaveColor = (updatedColor) => {
    if (colors.find((c) => c.id === updatedColor.id)) {
      setColors(
        colors.map((c) => (c.id === updatedColor.id ? updatedColor : c))
      );
    } else {
      setColors([...colors, updatedColor]);
    }
    setIsDrawerOpen(false);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingColor(null);
  };

  const handleToggleMenu = (colorId) => {
    setActiveMenu(activeMenu === colorId ? null : colorId);
  };

  const handleOutsideClick = () => {
    setActiveMenu(null);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setColors(arrayMoveImmutable(colors, oldIndex, newIndex));
  };

  return (
    <div className="kzui-design-system" onClick={handleOutsideClick}>
      <h1 className="kzui-design-system__title">Design System</h1>

      {/* Tabs */}
      <div className="kzui-design-system__tabs">
        <div>
          <button
            className={`kzui-design-system__tab ${
              activeTab === "color" ? "kzui-design-system__tab--active" : ""
            }`}
            onClick={() => setActiveTab("color")}
          >
            Color
          </button>
          <button
            className={`kzui-design-system__tab ${
              activeTab === "typography"
                ? "kzui-design-system__tab--active"
                : ""
            }`}
            onClick={() => setActiveTab("typography")}
          >
            Typography
          </button>
          <button
            className={`kzui-design-system__tab ${
              activeTab === "shadow" ? "kzui-design-system__tab--active" : ""
            }`}
            onClick={() => setActiveTab("shadow")}
          >
            Shadow
          </button>
        </div>
        <div className="kzui-design-system__search">
          <div className="kzui-search-input-wrapper">
            <SearchIcon className="kzui-search-icon" size={16} />
            <input
              type="text"
              className="kzui-search-input"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>

      {/* Conditional Content based on active tab */}
      <div className="kzui-design-system__content">
        {activeTab === "color" && (
          <>
            <div className="kzui-color-list__header">
              <span>Name</span>
              <span>Value</span>
              <span></span>
            </div>
            <SortableList
              colors={colors}
              onEdit={handleEditColor}
              onDuplicate={handleDuplicateColor}
              onDelete={handleDeleteColor}
              selectedItems={selectedItems}
              onSelect={handleSelect}
              onSortEnd={onSortEnd}
              activeMenu={activeMenu}
              onToggleMenu={handleToggleMenu}
              useDragHandle
            />
            <button
              className="kzui-design-system__add-button"
              onClick={handleAddColor}
            >
              <Plus size={16} />
              Add Color
            </button>
          </>
        )}

        {activeTab === "typography" && (
          <div>
            <h2>Typography</h2>
          </div>
        )}

        {activeTab === "shadow" && (
          <div>
            <h2>Shadow</h2>
          </div>
        )}
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className={`kzui-drawer open`}>
          <div style={{ flex: "1", overflowY: "auto" }}>
            <div
              className="kzui-drawer__input-group"
              style={{ borderBottom: "1px solid #dddddf" }}
            >
              <label className="kzui-drawer__label" htmlFor="colorName">
                Name
              </label>
              <input
                id="colorName"
                className="kzui-drawer__input"
                type="text"
                value={editingColor?.title || ""}
                onChange={(e) =>
                  setEditingColor({ ...editingColor, title: e.target.value })
                }
              />
            </div>

            {/* Color input group */}
            <div className="kzui-drawer__input-group">
              <label className="kzui-drawer__label" htmlFor="colorValue">
                Value
              </label>
              <div className="kzui-drawer__value-group">
                <span>Color</span>

                <div
                  className="kzui-value-box"
                  onClick={() => document.getElementById("colorValue").click()}
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span
                    className="kzui-color-item__color-icon"
                    style={{
                      backgroundColor: editingColor?.color || "#000000",
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                      borderRadius: "4px",
                    }}
                  ></span>
                  <span className="kzui-color-item__value">
                    {editingColor?.color || "#000000"}
                  </span>
                </div>

                {/* Hidden color input */}
                <input
                  id="colorValue"
                  className="kzui-drawer__input"
                  type="color"
                  value={editingColor?.color || "#000000"}
                  onChange={(e) =>
                    setEditingColor({ ...editingColor, color: e.target.value })
                  }
                  style={{
                    position: "absolute",
                    opacity: 0,
                    pointerEvents: "none",
                    width: "0",
                    height: "0",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Drawer buttons */}
          <div className="kzui-drawer__buttons">
            <button
              className="kzui-drawer__button kzui-drawer__button--cancel"
              onClick={handleCloseDrawer}
            >
              Cancel
            </button>
            <button
              className="kzui-drawer__button kzui-drawer__button--save"
              onClick={() => handleSaveColor(editingColor)}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
