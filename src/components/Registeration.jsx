import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./button/Button";
import { postProducts, postImage } from "../utils/api";
import { ERROR_MESSAGES } from "../utils/error_constants";
import useValidation from "../hooks/useValidation";
import styles from "./Registeration.module.css";
import TagList from "./TagList/TagList";

function Registration() {
  const {
    register,
    handleSubmit,
    trigger,
    clearErrors,
    setError,
    formState: { errors: formErrors, isValid },
  } = useForm({ mode: "onChange" });

  const { errors: validationErrors, validate } = useValidation();
  const [allTags, setAllTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const onSubmit = async (data) => {
    // console.log("allTags:", allTags);

    // const imageData = await imgToUrl(data.image[0]);

    // console.log(imageData);
    const sendData = {
      images: ["임시URL"],
      // images: imageData.url || [imageData.url],
      name: data.name,
      description: data.description,
      price: +data.price,
      tags: allTags,
    };

    // console.log(sendData);
    //   try {
    //     const response = await postProducts(sendData);
    //     console.log(response);
    //   } catch (error) {
    //     console.error("Error:", error);
    //   }
    // };

    // const imgToUrl = async (imgData) => {
    //   const imageUrl = await postImage(imgData);
    //   return imageUrl;
  };

  //유효성 검사 hook 사용을 위한 핸들러
  const handleBlur = async (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    if (register[name]) {
      validate(name, value);
      await trigger(name);
    }
  };

  const handleTagKeyPress = (e) => {
    console.log("실행됐나?");
    const inputTagName = e.target.value.trim();
    if (e.key === "Enter") {
      e.preventDefault();
      if (!inputTagName) {
        // 입력이 비어 있는 경우 오류 메시지 표시하고 종료
        setError("tags", {
          type: "manual",
          message: "태그는 필수 입력 항목입니다",
        });
        return;
      }
      if (inputTagName.length > 5) {
        // 5글자를 초과한 경우 오류 메시지 표시하고 종료
        setError("tags", {
          type: "manual",
          message: "태그는 5글자 이내로 입력하세요",
        });
        // console.log("5글자넘으면안됨");
        return;
      }
      // 오류가 없는 경우 태그 추가 및 입력 필드 초기화
      if (inputTagName) {
        setNewTag(""); // 먼저 newTag 상태를 비움
        setAllTags([...allTags, inputTagName]);
        // 오류 메시지 초기화
        clearErrors("tags");
      }
    }
  };

  // 태그 삭제 함수
  const handleTagDelete = (tagDelete) => {
    setAllTags(allTags.filter((tag) => tag !== tagDelete));
  };

  return (
    <form className={styles.form_container} onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.registration_title}>
        <h1>상품 등록하기</h1>
        <Button color="blue" type="submit" disabled={!isValid}>
          등록
        </Button>
      </section>
      <fieldset>
        <label>상품 이미지</label>
        <input
          className={`${styles.register_input} ${
            formErrors.image ? styles.input_error : ""
          }`}
          type="file"
          {...register("image", { required: true })}
          onBlur={handleBlur}
        />
        {/* {formErrors.image && (
          <span className={styles.error}>{ERROR_MESSAGES.image}</span>
        )} */}
      </fieldset>

      <fieldset>
        <label>상품명</label>
        <input
          className={`${styles.register_input} ${
            formErrors.name ? styles.input_error : ""
          }`}
          type="text"
          placeholder="상품명을 입력해주세요"
          {...register("name", {
            required: "상품명은 필수 입력 항목입니다.",
            minLength: {
              value: 1,
              message: "상품명은 최소 1자 이상이어야 합니다.",
            },
            maxLength: {
              value: 10,
              message: "상품명은 최대 10자 이내여야 합니다.",
            },
          })}
          onBlur={handleBlur}
        />
        {(formErrors.name || validationErrors.name) && (
          <span className={styles.error}>
            {formErrors.name ? formErrors.name.message : validationErrors.name}
          </span>
        )}
      </fieldset>

      <fieldset>
        <label>상품 소개</label>
        <textarea
          className={`${formErrors.description ? styles.input_error : ""}`}
          placeholder="상품 소개를 입력해주세요"
          {...register("description", {
            required: "상품 소개는 필수 입력 항목입니다.",
            minLength: {
              value: 10,
              message: "상품 소개는 최소 10자 이상이어야 합니다.",
            },
            maxLength: {
              value: 100,
              message: "상품 소개는 최대 100자 이내여야 합니다.",
            },
          })}
          onBlur={handleBlur}
        ></textarea>
        {(formErrors.description || validationErrors.description) && (
          <span className={styles.error}>
            {formErrors.description
              ? formErrors.description.message
              : validationErrors.description}
          </span>
        )}
      </fieldset>

      <fieldset>
        <label>판매가격</label>
        <input
          className={`${styles.register_input} ${
            formErrors.price ? styles.input_error : ""
          }`}
          type="text"
          placeholder="판매 가격을 입력해주세요"
          {...register("price", {
            required: "판매 가격은 필수 입력 항목입니다.",
            minLength: {
              value: 1,
              message: "판매 가격은 최소 1자 이상이어야 합니다.",
            },
            maxLength: {
              value: 100,
              message: "판매 가격은 최대 100자 이내여야 합니다.",
            },
            pattern: {
              value: /^\d+$/,
              message: "숫자만 입력해주세요.",
            },
          })}
          onBlur={handleBlur}
        />
        {(formErrors.price || validationErrors.price) && (
          <span className={styles.error}>
            {formErrors.price
              ? formErrors.price.message
              : validationErrors.price}
          </span>
        )}
      </fieldset>

      <fieldset>
        <label>태그</label>
        <input
          className={`${styles.register_input} ${
            formErrors.tags ? styles.input_error : ""
          }`}
          type="text"
          placeholder="태그를 입력해주세요"
          onKeyDown={handleTagKeyPress}
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        {formErrors.tags && (
          <span className={styles.error}>{formErrors.tags.message}</span>
        )}
        <TagList tags={allTags} handleTagDelete={handleTagDelete} />
      </fieldset>
    </form>
  );
}

export default Registration;
